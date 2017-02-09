'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BluetoothPermissionError = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _application = require('application');

var _application2 = _interopRequireDefault(_application);

var _nativescriptPermissions = require('nativescript-permissions');

var _nativescriptPermissions2 = _interopRequireDefault(_nativescriptPermissions);

var _errors = require('../errors');

var _parameterValidator = require('parameter-validator');

var _BluetoothScanCallback = require('./BluetoothScanCallback');

var _BluetoothScanCallback2 = _interopRequireDefault(_BluetoothScanCallback);

var _MidiBluetoothDevice = require('./MidiBluetoothDevice');

var _MidiBluetoothDevice2 = _interopRequireDefault(_MidiBluetoothDevice);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global android, java */
var BLUETOOTH_SERVICE = android.content.Context.BLUETOOTH_SERVICE;
var _android$bluetooth$le = android.bluetooth.le,
    ScanFilter = _android$bluetooth$le.ScanFilter,
    ScanSettings = _android$bluetooth$le.ScanSettings;
var SCAN_MODE_LOW_LATENCY = ScanSettings.SCAN_MODE_LOW_LATENCY,
    CALLBACK_TYPE_ALL_MATCHES = ScanSettings.CALLBACK_TYPE_ALL_MATCHES;
var _java$util = java.util,
    ArrayList = _java$util.ArrayList,
    UUID = _java$util.UUID;


// Service identifier, per the BLE MIDI spec published by Apple.
var BLE_MIDI_SERVICE_UUID = '03B80E5A-EDE8-4B33-A751-6CE34EC4C700';

/**
* Error which indicates that the application was unable to get permission to use bluetooth.
*
* @private
*/

var BluetoothPermissionError = exports.BluetoothPermissionError = function (_ExtendableError) {
    _inherits(BluetoothPermissionError, _ExtendableError);

    function BluetoothPermissionError() {
        _classCallCheck(this, BluetoothPermissionError);

        return _possibleConstructorReturn(this, (BluetoothPermissionError.__proto__ || Object.getPrototypeOf(BluetoothPermissionError)).apply(this, arguments));
    }

    return BluetoothPermissionError;
}(_errors.ExtendableError);

/**
* Scans for BLE MIDI devices on Android.
*
* @private
*/


var BluetoothScanner = function () {
    function BluetoothScanner(options) {
        var _this2 = this;

        _classCallCheck(this, BluetoothScanner);

        (0, _parameterValidator.validate)(options, ['logger'], this);

        this._isScanning = false;
        this._devices = [];
        this._deviceAddedListeners = [];
        this._scanFailedListeners = [];

        var bluetoothManager = _application2.default.android.currentContext.getSystemService(BLUETOOTH_SERVICE);
        this._bluetoothScanner = bluetoothManager.getAdapter().getBluetoothLeScanner();

        this.addDeviceAddedListener(function (device) {
            return _this2._devices.push(device);
        });
        this.addScanFailedListener(function (errorMessage) {

            _this2.logger.error('Bluetooth LE scan failed: ' + errorMessage);
            _this2._isScanning = false;
            if (typeof _this2._rejectGetDeviceRequest === 'function') {
                _this2._getDevicesRequestRejected = true;
                _this2._rejectGetDeviceRequest(new Error(errorMessage));
            }
            _this2._rejectGetDeviceRequest = null;
        });
    }

    /**
    * Starts a Bluetooth LE scan for MIDI and returns the devices found after the given timeout.
    *
    * @param {Object} options
    * @param {int}    options.timeout
    * @returns {Promise.<Array.<MidiBluetoothDevice>>}
    */


    _createClass(BluetoothScanner, [{
        key: 'getDevices',
        value: function getDevices(options) {
            var _this3 = this;

            return (0, _parameterValidator.validateAsync)(options, ['timeout']).then(function () {

                _this3._log('Getting permissions required for bluetooth...');

                return _nativescriptPermissions2.default.requestPermission(android.Manifest.permission.ACCESS_COARSE_LOCATION, 'Android requires location permission in order to use bluetooth.').catch(function () {
                    throw new BluetoothPermissionError('Unable to get the permissions required to use bluetooth.');
                });
            }).then(function () {

                _this3._log('Getting BLE MIDI devices...');

                var resolve = void 0;
                var promise = new Promise(function (_resolve, _reject) {
                    resolve = _resolve;
                    _this3._rejectGetDeviceRequest = _reject;
                    _this3._getDevicesRequestRejected = false;
                });

                _this3.startScan();

                setTimeout(function () {
                    if (!_this3._getDevicesRequestRejected) {
                        _this3._log('Finished getting MIDI devices. Returning ' + _this3._devices.length + ' devices.');
                        resolve(_this3._devices);
                    }
                    _this3._rejectGetDeviceRequest = null;
                    // Don't stop the scan - keep it going so that new devices can be detected and the application can
                    // be alerted via a callback registered with `addDeviceAddedListener`.
                }, options.timeout);

                return promise;
            }).catch(function (error) {
                _this3.logger.error('An error occurred while getting Bluetooth LE MIDI devices.', { error: error });
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

    }, {
        key: 'addDeviceAddedListener',
        value: function addDeviceAddedListener(callback) {
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

    }, {
        key: 'addScanFailedListener',
        value: function addScanFailedListener(callback) {
            this._scanFailedListeners.push(callback);
        }
    }, {
        key: 'startScan',
        value: function startScan() {

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

            var serviceUuid = UUID.fromString(BLE_MIDI_SERVICE_UUID);

            var scanFilter = new ScanFilter.Builder().setServiceUuid(new android.os.ParcelUuid(serviceUuid)).build();
            var scanFilters = new ArrayList();
            scanFilters.add(scanFilter);

            this._scanCallback = new _BluetoothScanCallback2.default();
            this._scanCallback.setCallbacks({
                onScanResult: this._onScanResult.bind(this),
                onScanFailed: this._onScanFailed.bind(this)
            });

            // Use a callback type of CALLBACK_TYPE_ALL_MATCHES, because some hardware (like the Nexus 5)
            // don't support the filtered FIRST_MATCH and MATCH_LOST callback types.
            var scanSettings = new ScanSettings.Builder().setCallbackType(CALLBACK_TYPE_ALL_MATCHES).setScanMode(SCAN_MODE_LOW_LATENCY).build();

            this._bluetoothScanner.startScan(scanFilters, scanSettings, this._scanCallback);
            this._isScanning = true;
            this._log('Bluetooth scan started.');
        }
    }, {
        key: 'stopScan',
        value: function stopScan() {

            if (!this._isScanning) {
                this._log('Not stopping a bluetooth scan, because no scan is currently in progress.');
                return;
            }
            this._log('Stopping a bluetooth scan...');
            this._bluetoothScanner.stopScan(this._scanCallback);
            this._isScanning = false;
            this._log('Bluetooth scan stopped.');
        }
    }, {
        key: '_onScanResult',
        value: function _onScanResult(callbackType, result) {

            if (callbackType !== CALLBACK_TYPE_ALL_MATCHES) {
                // This shouldn't happen.
                return;
            }

            var nativeDevice = result.getDevice(),
                address = nativeDevice.getAddress();

            var existingDevice = this._devices.find(function (d) {
                return d.address === address;
            });

            if (existingDevice) {
                // Only notify listeners the first time a device sends advertising data.
                return;
            }

            var device = new _MidiBluetoothDevice2.default({ nativeDevice: nativeDevice });

            this._log('Notifying ' + this._deviceAddedListeners.length + ' callbacks of new bluetooth device with address \'' + address + '\'.');

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._deviceAddedListeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var callback = _step.value;

                    try {
                        callback(device);
                    } catch (error) {
                        this.logger.error('An error occurred while calling the callback \'' + callback.name + '\'.', { error: error });
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this._log('Finished handling bluetooth scan result.');
        }
    }, {
        key: '_onScanFailed',
        value: function _onScanFailed(errorCode) {

            var errorName = _BluetoothScanCallback.BLE_SCAN_ERROR[errorCode];

            var message = errorName ? 'Bluetooth LE scan failed due to \'' + errorName + '\'.' : 'Bluetooth LE scan failed due to unknown error with code \'' + errorCode + '\'.';

            this.logger.error(message);

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this._scanFailedListeners[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var callback = _step2.value;

                    try {
                        callback(message);
                    } catch (error) {
                        this.logger.error('An error occurred while calling the callback \'' + callback.name + '\'.', { error: error });
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }, {
        key: '_log',
        value: function _log(message, metadata) {
            this.logger.info(this.constructor.name + ': ' + message, metadata);
        }
    }]);

    return BluetoothScanner;
}();

exports.default = BluetoothScanner;