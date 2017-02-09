'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _nativescriptComponent = require('nativescript-component');

var _nativescriptComponent2 = _interopRequireDefault(_nativescriptComponent);

var _parameterValidator = require('parameter-validator');

var _observableArray = require('data/observable-array');

var _observable = require('data/observable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BleDevicesPage = function (_Component) {
    _inherits(BleDevicesPage, _Component);

    function BleDevicesPage() {
        _classCallCheck(this, BleDevicesPage);

        return _possibleConstructorReturn(this, (BleDevicesPage.__proto__ || Object.getPrototypeOf(BleDevicesPage)).apply(this, arguments));
    }

    _createClass(BleDevicesPage, [{
        key: 'onNavigatingTo',


        /**
        * @override
        */
        value: function onNavigatingTo() {
            var _this2 = this;

            _get(BleDevicesPage.prototype.__proto__ || Object.getPrototypeOf(BleDevicesPage.prototype), 'onNavigatingTo', this).apply(this, arguments);

            var dependencies = this.get('dependencies');
            (0, _parameterValidator.validate)(dependencies, ['midiDeviceManager', 'logger'], this, { addPrefix: '_' });

            return this._loadBluetoothDevices().then(function () {
                _this2._log('Attaching bluetooth device listeners.');
                _this2._midiDeviceManager.addBluetoothDeviceAddedListener(_this2._onDeviceAdded.bind(_this2));
                _this2._midiDeviceManager.addBluetoothScanFailedListener(_this2._onScanFailed.bind(_this2));
            }).catch(function (error) {
                _this2._logger.error('An error occurred while loading bluetooth devices.', { error: error });
            });
        }
    }, {
        key: '_formatDeviceForDisplay',
        value: function _formatDeviceForDisplay(device) {
            var observableDevice = new _observable.Observable(device);
            observableDevice.set('status', '');
            return observableDevice;
        }
    }, {
        key: '_loadBluetoothDevices',
        value: function _loadBluetoothDevices() {
            var _this3 = this;

            this._log('Getting bluetooth devices...');

            this.set('isLoading', true);
            return this._midiDeviceManager.getBluetoothDevices({ timeout: 2000 }).then(function (devices) {
                _this3._log('Successfully found ' + devices.length + ' bluetooth devices.');

                var formattedDevices = devices.map(function (device) {
                    return _this3._formatDeviceForDisplay(device);
                });
                _this3.set('devices', new _observableArray.ObservableArray(formattedDevices));
            }).catch(function (error) {
                _this3._logger.error('An error occurred while getting bluetooth devices.', { error: error });
            }).then(function () {
                _this3.set('isLoading', false);
                _this3._log('Finished getting bluetooth devices.');
            });
        }
    }, {
        key: '_log',
        value: function _log(message, metadata) {
            this._logger.info(this.constructor.name + ': ' + message, metadata);
        }

        /**
        * @param {BluetoothDevice} device
        */

    }, {
        key: '_onDeviceAdded',
        value: function _onDeviceAdded(device) {
            this._log('Adding new bluetooth device named \'' + device.name + '\'');
            var formattedDevice = this._formatDeviceForDisplay(device);
            this.get('devices').push(formattedDevice);
        }
    }, {
        key: '_onScanFailed',
        value: function _onScanFailed(message) {
            /** @todo - Consider showing an error message to the user. */
            this._logger.error(message);
        }
    }]);

    return BleDevicesPage;
}(_nativescriptComponent2.default);

BleDevicesPage.export(exports);