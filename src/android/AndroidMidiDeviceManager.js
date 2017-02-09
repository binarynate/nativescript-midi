/* global android */
const { MIDI_SERVICE } = android.content.Context;
const { OnDeviceOpenedListener } = android.media.midi.MidiManager;
const { DeviceCallback } = android.media.midi.MidiManager;
import app from 'application';
import frame from 'ui/frame';
import { validateAsync } from 'parameter-validator';
import MidiDeviceManager from '../MidiDeviceManager';
import AndroidMidiDevice from './AndroidMidiDevice';
import BluetoothScanner from './BluetoothScanner';

/**
* Responsible for fetching available MIDI devices and notifying the application of device changes
* on the Android platform.
*/
class AndroidMidiDeviceManager extends MidiDeviceManager {

    constructor() {

        super(...arguments);
        this._midiManager = app.android.currentContext.getSystemService(MIDI_SERVICE);
        this._registerDeviceCallback();
        this._bluetoothScanner = new BluetoothScanner({ logger: this.logger });
    }

    /**
    * @override
    */
    getDevices() {

        return Promise.resolve()
        .then(() => {
            this._log('Getting MIDI devices...');

            let deviceInfos = this._midiManager.getDevices();
            let devices = Array.from(deviceInfos).map(deviceInfo => new AndroidMidiDevice({ deviceInfo, logger: this.logger }));
            this._log(`Returning ${devices.length} devices.`);
            return devices;
        })
        .catch(error => {
            this.logger.error(`An error occurred while getting MIDI devices.`, { error });
        });
    }

    /**
    * @override
    */
    showBluetoothDevicePage() {

        /**
        * @todo - Navigating with this `moduleName` won't work once this page is imported from a module.
        *         Check whether the plugin name can be used in the `moduleName` as indicated here:
        *         https://docs.nativescript.org/plugins/ui-plugin
        *
        *         - Try a moduleName of 'nativescript-midi/android/ble-device-page/ble-device-page'
        *         - If that doesn't work, navigate() can also accept a function which creates a
        *           view. That could potentially be used.
        */
        return frame.topmost().navigate({
            moduleName: 'dev/android/components/ble-devices-page/ble-devices-page',
            context: {
                dependencies: {
                    midiDeviceManager: this,
                    logger: this.logger
                }
            }
        });
    }

    get bluetoothIsSupported() {

        // TODO: check at runtime if transport over bluetooth is supported.
        // https://developer.android.com/guide/topics/connectivity/bluetooth-le.html


        // // Use this check to determine whether BLE is supported on the device. Then
        // // you can selectively disable BLE-related features.
        // if (!getPackageManager().hasSystemFeature(PackageManager.FEATURE_BLUETOOTH_LE)) {
        //     Toast.makeText(this, R.string.ble_not_supported, Toast.LENGTH_SHORT).show();
        //     finish();
        // }
        return true;
    }

    /*
    * Private APIs for managing bluetooth low energy MIDI devices. `showBluetoothDevicePage()`
    * is the public method for managing bluetooth devices. If you have a use-case for which
    * it would be helpful to make these method public, please open an issue on GitHub.
    */

    /**
    * @returns {Promise.<Array.<MidiBluetoothDevice>>}
    * @private
    */
    getBluetoothDevices() {
        return this._bluetoothScanner.getDevices(...arguments);
    }

    /**
    * @private
    */
    addBluetoothDeviceAddedListener() {
        return this._bluetoothScanner.addDeviceAddedListener(...arguments);
    }

    /**
    * @private
    */
    addBluetoothScanFailedListener() {
        return this._bluetoothScanner.addScanFailedListener(...arguments);
    }

    /**
    * @private
    */
    stopBluetoothScan() {
        return this._bluetoothScanner.stopScan(...arguments);
    }

    /**
    * @param   {Object}              options
    * @param   {MidiBluetoothDevice} options.bluetoothDevice
    * @returns {Promise}
    * @private
    */
    connectToBluetoothDevice(options) {

        return validateAsync(options, [ 'bluetoothDevice' ])
        .then(({ bluetoothDevice }) => {

            let { nativeDevice } = bluetoothDevice;

            let resolve,
                promise = new Promise(_resolve => resolve = _resolve);


            let onDeviceOpened = () => {
                // The registered `DeviceCallback` is also notified of the added MIDI device,
                // so it will actually handle the new device.
                this._log('Successfully opened MIDI bluetooth device.');
                resolve();
            };
            let onDeviceOpenedListener = new OnDeviceOpenedListener({ onDeviceOpened });

            this._midiManager.openBluetoothDevice(nativeDevice, onDeviceOpenedListener, null);
            return promise;
        });
    }

    /**
    * Registers the callbacks with Android to be notified when MIDI devices change.
    * @private
    */
    _registerDeviceCallback() {

        let onDeviceAdded = midiDeviceInfo => {
            this._log(`Received notification from Android for added MIDI device.`);
            let device = new AndroidMidiDevice({ midiDeviceInfo, logger: this.logger });
            this._addDevice(device);
        };

        let onDeviceRemoved = midiDeviceInfo => {
            this._log(`Received notification from Android for removed MIDI device.`);
            let device = this._devices.find(d => d._midiDeviceInfo.equals(midiDeviceInfo));
            if (device) {
                this._removeDevice(device);
            }
        };

        let onDeviceStatusChanged = (/* status */) => {
            this._log(`Received notification from Android for update MIDI device.`);
            console.log('Device status changed.');
        };

        const Callback = DeviceCallback.extend({
            init() {},
            onDeviceAdded,
            onDeviceRemoved,
            onDeviceStatusChanged
        });

        let callback = new Callback();
        this._midiManager.registerDeviceCallback(callback, null);
    }
}

export default AndroidMidiDeviceManager;
