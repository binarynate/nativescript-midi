/* global android, java */
const { BLUETOOTH_SERVICE } = android.content.Context;
const { ScanFilter, ScanSettings } = android.bluetooth.le;
const { SCAN_MODE_LOW_LATENCY, CALLBACK_TYPE_ALL_MATCHES } = ScanSettings;
const { ArrayList, UUID } = java.util;
import app from 'application';
import permissions from 'nativescript-permissions';
import { ExtendableError } from '../errors';
import { validate, validateAsync } from 'parameter-validator';
import BluetoothScanCallback, { BLE_SCAN_ERROR } from './BluetoothScanCallback';
import MidiBluetoothDevice from './MidiBluetoothDevice';

// Service identifier, per the BLE MIDI spec published by Apple.
const BLE_MIDI_SERVICE_UUID = '03B80E5A-EDE8-4B33-A751-6CE34EC4C700';

/**
* Error which indicates that the application was unable to get permission to use bluetooth.
*
* @private
*/
export class BluetoothPermissionError extends ExtendableError {}

/**
* Scans for BLE MIDI devices on Android.
*
* @private
*/
export default class BluetoothScanner {

    constructor(options) {
        validate(options, [ 'logger' ], this);

        this._isScanning = false;
        this._devices = [];
        this._deviceAddedListeners = [];
        this._scanFailedListeners = [];

        let bluetoothManager = app.android.currentContext.getSystemService(BLUETOOTH_SERVICE);
        this._bluetoothScanner = bluetoothManager.getAdapter().getBluetoothLeScanner();

        this.addDeviceAddedListener(device => this._devices.push(device));
        this.addScanFailedListener(errorMessage => {

            this.logger.error(`Bluetooth LE scan failed: ${errorMessage}`);
            this._isScanning = false;
            if (typeof this._rejectGetDeviceRequest === 'function') {
                this._getDevicesRequestRejected = true;
                this._rejectGetDeviceRequest(new Error(errorMessage));
            }
            this._rejectGetDeviceRequest = null;
        });
    }

    /**
    * Starts a Bluetooth LE scan for MIDI and returns the devices found after the given timeout.
    *
    * @param {Object} options
    * @param {int}    options.timeout
    * @returns {Promise.<Array.<MidiBluetoothDevice>>}
    */
    getDevices(options) {

        return validateAsync(options, [ 'timeout' ])
        .then(() => {

            this._log('Getting permissions required for bluetooth...');

            return permissions.requestPermission(
                android.Manifest.permission.ACCESS_COARSE_LOCATION,
                'Android requires location permission in order to use bluetooth.'
            )
            .catch(() => {
                throw new BluetoothPermissionError(`Unable to get the permissions required to use bluetooth.`);
            });
        })
        .then(() => {

            this._log('Getting BLE MIDI devices...');

            let resolve;
            let promise = new Promise((_resolve, _reject) => {
                resolve = _resolve;
                this._rejectGetDeviceRequest = _reject;
                this._getDevicesRequestRejected = false;
            });

            this.startScan();

            setTimeout(() => {
                if (!this._getDevicesRequestRejected) {
                    this._log(`Finished getting MIDI devices. Returning ${this._devices.length} devices.`);
                    resolve(this._devices);
                }
                this._rejectGetDeviceRequest = null;
                // Don't stop the scan - keep it going so that new devices can be detected and the application can
                // be alerted via a callback registered with `addDeviceAddedListener`.
            }, options.timeout);

            return promise;
        })
        .catch(error => {
            this.logger.error(`An error occurred while getting Bluetooth LE MIDI devices.`, { error });
            throw error;
        });
    }

    /**
    * A callback that responds to a device change event.
    *
    * @callback bluetoothDeviceEventCallback
    * @param {MidiBluetoothDevice}
    */

    /**
    * @param {bluetoothDeviceEventCallback} callback
    */
    addDeviceAddedListener(callback) {
        this._deviceAddedListeners.push(callback);
    }

    /**
    * A callback that is notified when a bluetooth scan fails.
    *
    * @callback bluetoothScanFailedCallback
    * @param {string} errorMessage
    */

    /**
    * @param {bluetoothScanFailedCallback} callback
    */
    addScanFailedListener(callback) {
        this._scanFailedListeners.push(callback);
    }

    startScan() {

        if (this._isScanning) {
            this.stopScan();
        }

        this._log('Starting a bluetooth scan...');

        /** @todo - Check if bluetooth is supported on this device */

        /** @todo - Check if bluetooth is enabled and, if not, prompt the user to enable it */

        // // Ensures Bluetooth is available on the device and it is enabled. If not,
        // // displays a dialog requesting user permission to enable Bluetooth.
        // if (bluetoothAdapter === null || !bluetoothAdapter.isEnabled()) {
        //     enableBluetoothIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
        //     startActivityForResult(enableBluetoothIntent, REQUEST_ENABLE_BT);
        // }

        this._devices = [];

        let serviceUuid = UUID.fromString(BLE_MIDI_SERVICE_UUID);

        let scanFilter = new ScanFilter.Builder()
                                            .setServiceUuid(new android.os.ParcelUuid(serviceUuid))
                                            .build();
        let scanFilters = new ArrayList();
        scanFilters.add(scanFilter);


        this._scanCallback = new BluetoothScanCallback();
        this._scanCallback.setCallbacks({
            onScanResult: this._onScanResult.bind(this),
            onScanFailed: this._onScanFailed.bind(this)
        });

        // Use a callback type of CALLBACK_TYPE_ALL_MATCHES, because some hardware (like the Nexus 5)
        // don't support the filtered FIRST_MATCH and MATCH_LOST callback types.
        let scanSettings = new ScanSettings.Builder()
                                           .setCallbackType(CALLBACK_TYPE_ALL_MATCHES)
                                           .setScanMode(SCAN_MODE_LOW_LATENCY)
                                           .build();

        this._bluetoothScanner.startScan(scanFilters, scanSettings, this._scanCallback);
        this._isScanning = true;
        this._log('Bluetooth scan started.');
    }

    stopScan() {

        if (!this._isScanning) {
            this._log('Not stopping a bluetooth scan, because no scan is currently in progress.');
            return;
        }
        this._log('Stopping a bluetooth scan...');
        this._bluetoothScanner.stopScan(this._scanCallback);
        this._isScanning = false;
        this._log('Bluetooth scan stopped.');
    }

    _onScanResult(callbackType, result) {

        if (callbackType !== CALLBACK_TYPE_ALL_MATCHES) {
            // This shouldn't happen.
            return;
        }

        let nativeDevice = result.getDevice(),
            address = nativeDevice.getAddress();

        let existingDevice = this._devices.find(d => d.address === address);

        if (existingDevice) {
            // Only notify listeners the first time a device sends advertising data.
            return;
        }

        let device = new MidiBluetoothDevice({ nativeDevice });

        this._log(`Notifying ${this._deviceAddedListeners.length} callbacks of new bluetooth device with address '${address}'.`);

        for (let callback of this._deviceAddedListeners) {
            try {
                callback(device);
            } catch (error) {
                this.logger.error(`An error occurred while calling the callback '${callback.name}'.`, { error });
            }
        }
        this._log('Finished handling bluetooth scan result.');
    }

    _onScanFailed(errorCode) {

        let errorName = BLE_SCAN_ERROR[errorCode];

        let message = errorName ? `Bluetooth LE scan failed due to '${errorName}'.`
                                : `Bluetooth LE scan failed due to unknown error with code '${errorCode}'.`;

        this.logger.error(message);

        for (let callback of this._scanFailedListeners) {
            try {
                callback(message);
            } catch (error) {
                this.logger.error(`An error occurred while calling the callback '${callback.name}'.`, { error });
            }
        }
    }

    _log(message, metadata) {
        this.logger.info(`${this.constructor.name}: ${message}`, metadata);
    }
}
