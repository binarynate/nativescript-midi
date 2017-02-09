'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _application = require('application');

var _application2 = _interopRequireDefault(_application);

var _frame = require('ui/frame');

var _frame2 = _interopRequireDefault(_frame);

var _parameterValidator = require('parameter-validator');

var _MidiDeviceManager2 = require('../MidiDeviceManager');

var _MidiDeviceManager3 = _interopRequireDefault(_MidiDeviceManager2);

var _AndroidMidiDevice = require('./AndroidMidiDevice');

var _AndroidMidiDevice2 = _interopRequireDefault(_AndroidMidiDevice);

var _BluetoothScanner = require('./BluetoothScanner');

var _BluetoothScanner2 = _interopRequireDefault(_BluetoothScanner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global android */
var MIDI_SERVICE = android.content.Context.MIDI_SERVICE;
var OnDeviceOpenedListener = android.media.midi.MidiManager.OnDeviceOpenedListener;
var DeviceCallback = android.media.midi.MidiManager.DeviceCallback;

/**
* Responsible for fetching available MIDI devices and notifying the application of device changes
* on the Android platform.
*/
var AndroidMidiDeviceManager = function (_MidiDeviceManager) {
    _inherits(AndroidMidiDeviceManager, _MidiDeviceManager);

    function AndroidMidiDeviceManager() {
        _classCallCheck(this, AndroidMidiDeviceManager);

        var _this = _possibleConstructorReturn(this, (AndroidMidiDeviceManager.__proto__ || Object.getPrototypeOf(AndroidMidiDeviceManager)).apply(this, arguments));

        _this._midiManager = _application2.default.android.currentContext.getSystemService(MIDI_SERVICE);
        _this._registerDeviceCallback();
        _this._bluetoothScanner = new _BluetoothScanner2.default({ logger: _this.logger });
        return _this;
    }

    /**
    * @override
    */


    _createClass(AndroidMidiDeviceManager, [{
        key: 'getDevices',
        value: function getDevices() {
            var _this2 = this;

            return Promise.resolve().then(function () {
                _this2._log('Getting MIDI devices...');

                var deviceInfos = _this2._midiManager.getDevices();
                var devices = Array.from(deviceInfos).map(function (deviceInfo) {
                    return new _AndroidMidiDevice2.default({ deviceInfo: deviceInfo, logger: _this2.logger });
                });
                _this2._log('Returning ' + devices.length + ' devices.');
                return devices;
            }).catch(function (error) {
                _this2.logger.error('An error occurred while getting MIDI devices.', { error: error });
            });
        }

        /**
        * @override
        */

    }, {
        key: 'showBluetoothDevicePage',
        value: function showBluetoothDevicePage() {

            /**
            * @todo - Navigating with this `moduleName` won't work once this page is imported from a module.
            *         Check whether the plugin name can be used in the `moduleName` as indicated here:
            *         https://docs.nativescript.org/plugins/ui-plugin
            *
            *         - Try a moduleName of 'nativescript-midi/android/ble-device-page/ble-device-page'
            *         - If that doesn't work, navigate() can also accept a function which creates a
            *           view. That could potentially be used.
            */
            return _frame2.default.topmost().navigate({
                moduleName: 'dev/android/components/ble-devices-page/ble-devices-page',
                context: {
                    dependencies: {
                        midiDeviceManager: this,
                        logger: this.logger
                    }
                }
            });
        }
    }, {
        key: 'getBluetoothDevices',


        /*
        * Private APIs for managing bluetooth low energy MIDI devices. `showBluetoothDevicePage()`
        * is the public method for managing bluetooth devices. If you have a use-case for which
        * it would be helpful to make these method public, please open an issue on GitHub.
        */

        /**
        * @returns {Promise.<Array.<MidiBluetoothDevice>>}
        * @private
        */
        value: function getBluetoothDevices() {
            var _bluetoothScanner;

            return (_bluetoothScanner = this._bluetoothScanner).getDevices.apply(_bluetoothScanner, arguments);
        }

        /**
        * @private
        */

    }, {
        key: 'addBluetoothDeviceAddedListener',
        value: function addBluetoothDeviceAddedListener() {
            var _bluetoothScanner2;

            return (_bluetoothScanner2 = this._bluetoothScanner).addDeviceAddedListener.apply(_bluetoothScanner2, arguments);
        }

        /**
        * @private
        */

    }, {
        key: 'addBluetoothScanFailedListener',
        value: function addBluetoothScanFailedListener() {
            var _bluetoothScanner3;

            return (_bluetoothScanner3 = this._bluetoothScanner).addScanFailedListener.apply(_bluetoothScanner3, arguments);
        }

        /**
        * @private
        */

    }, {
        key: 'stopBluetoothScan',
        value: function stopBluetoothScan() {
            var _bluetoothScanner4;

            return (_bluetoothScanner4 = this._bluetoothScanner).stopScan.apply(_bluetoothScanner4, arguments);
        }

        /**
        * @param   {Object}              options
        * @param   {MidiBluetoothDevice} options.bluetoothDevice
        * @returns {Promise}
        * @private
        */

    }, {
        key: 'connectToBluetoothDevice',
        value: function connectToBluetoothDevice(options) {
            var _this3 = this;

            return (0, _parameterValidator.validateAsync)(options, ['bluetoothDevice']).then(function (_ref) {
                var bluetoothDevice = _ref.bluetoothDevice;
                var nativeDevice = bluetoothDevice.nativeDevice;


                var resolve = void 0,
                    promise = new Promise(function (_resolve) {
                    return resolve = _resolve;
                });

                var onDeviceOpened = function onDeviceOpened() {
                    // The registered `DeviceCallback` is also notified of the added MIDI device,
                    // so it will actually handle the new device.
                    _this3._log('Successfully opened MIDI bluetooth device.');
                    resolve();
                };
                var onDeviceOpenedListener = new OnDeviceOpenedListener({ onDeviceOpened: onDeviceOpened });

                _this3._midiManager.openBluetoothDevice(nativeDevice, onDeviceOpenedListener, null);
                return promise;
            });
        }

        /**
        * Registers the callbacks with Android to be notified when MIDI devices change.
        * @private
        */

    }, {
        key: '_registerDeviceCallback',
        value: function _registerDeviceCallback() {
            var _this4 = this;

            var onDeviceAdded = function onDeviceAdded(midiDeviceInfo) {
                _this4._log('Received notification from Android for added MIDI device.');
                var device = new _AndroidMidiDevice2.default({ midiDeviceInfo: midiDeviceInfo, logger: _this4.logger });
                _this4._addDevice(device);
            };

            var onDeviceRemoved = function onDeviceRemoved(midiDeviceInfo) {
                _this4._log('Received notification from Android for removed MIDI device.');
                var device = _this4._devices.find(function (d) {
                    return d._midiDeviceInfo.equals(midiDeviceInfo);
                });
                if (device) {
                    _this4._removeDevice(device);
                }
            };

            var onDeviceStatusChanged = function onDeviceStatusChanged() /* status */{
                _this4._log('Received notification from Android for update MIDI device.');
                console.log('Device status changed.');
            };

            var Callback = DeviceCallback.extend({
                init: function init() {},

                onDeviceAdded: onDeviceAdded,
                onDeviceRemoved: onDeviceRemoved,
                onDeviceStatusChanged: onDeviceStatusChanged
            });

            var callback = new Callback();
            this._midiManager.registerDeviceCallback(callback, null);
        }
    }, {
        key: 'bluetoothIsSupported',
        get: function get() {

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
    }]);

    return AndroidMidiDeviceManager;
}(_MidiDeviceManager3.default);

exports.default = AndroidMidiDeviceManager;