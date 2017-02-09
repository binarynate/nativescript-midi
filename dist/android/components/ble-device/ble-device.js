'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _nativescriptComponent = require('nativescript-component');

var _nativescriptComponent2 = _interopRequireDefault(_nativescriptComponent);

var _parameterValidator = require('parameter-validator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BleDeviceComponent = function (_Component) {
    _inherits(BleDeviceComponent, _Component);

    function BleDeviceComponent() {
        _classCallCheck(this, BleDeviceComponent);

        return _possibleConstructorReturn(this, (BleDeviceComponent.__proto__ || Object.getPrototypeOf(BleDeviceComponent)).apply(this, arguments));
    }

    _createClass(BleDeviceComponent, [{
        key: 'onLoaded',
        value: function onLoaded() {

            _get(BleDeviceComponent.prototype.__proto__ || Object.getPrototypeOf(BleDeviceComponent.prototype), 'onLoaded', this).apply(this, arguments);
            var dependencies = this.get('dependencies');
            (0, _parameterValidator.validate)(dependencies, ['midiDeviceManager', 'logger'], this, { addPrefix: '_' });
            this._updateStatus();
        }
    }, {
        key: 'onTap',
        value: function onTap() {
            var _this2 = this;

            this.set('status', 'Connecting...');
            return this._connect().catch(function (error) {
                _this2._error('An error occurred while trying to connect to a MIDI bluetooth device.', { error: error });
            }).then(function () {
                _this2._updateStatus();
            });
        }
    }, {
        key: '_connect',
        value: function _connect() {
            var _this3 = this;

            var bluetoothDevice = this.bindingContext;
            return this._midiDeviceManager.connectToBluetoothDevice({ bluetoothDevice: bluetoothDevice }).then(function () {
                _this3.set('isConnected', true);
            });
        }
    }, {
        key: '_error',
        value: function _error(message, metadata) {
            this.logger.error(this.constructor.name + ': ' + message, metadata);
        }
    }, {
        key: '_log',
        value: function _log(message, metadata) {
            this.logger.info(this.constructor.name + ': ' + message, metadata);
        }
    }, {
        key: '_updateStatus',
        value: function _updateStatus() {
            var status = this.get('isConnected') ? 'Connected' : 'Not Connected';
            this.set('status', status);
        }
    }]);

    return BleDeviceComponent;
}(_nativescriptComponent2.default);

BleDeviceComponent.export(exports);