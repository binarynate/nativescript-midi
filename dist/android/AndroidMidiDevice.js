'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _parameterValidator = require('parameter-validator');

var _MidiDevice2 = require('../MidiDevice');

var _MidiDevice3 = _interopRequireDefault(_MidiDevice2);

var _AndroidMidiInputPort = require('./AndroidMidiInputPort');

var _AndroidMidiInputPort2 = _interopRequireDefault(_AndroidMidiInputPort);

var _AndroidMidiOutputPort = require('./AndroidMidiOutputPort');

var _AndroidMidiOutputPort2 = _interopRequireDefault(_AndroidMidiOutputPort);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global android */
var MidiDeviceInfo = android.media.midi.MidiDeviceInfo;
var TYPE_INPUT = android.media.midi.MidiDeviceInfo.PortInfo.TYPE_INPUT;

var AndroidMidiDevice = function (_MidiDevice) {
    _inherits(AndroidMidiDevice, _MidiDevice);

    /**
    * @param {Object} options
    * @param {android.media.midi.MidiDeviceInfo} options.midiDeviceInfo
    */
    function AndroidMidiDevice(options) {
        _classCallCheck(this, AndroidMidiDevice);

        var _this = _possibleConstructorReturn(this, (AndroidMidiDevice.__proto__ || Object.getPrototypeOf(AndroidMidiDevice)).apply(this, arguments));

        (0, _parameterValidator.validate)(options, ['midiDeviceInfo'], _this, { addPrefix: '_' });
        var properties = _this._midiDeviceInfo.getProperties();
        _this._name = properties.getString(MidiDeviceInfo.PROPERTY_NAME);
        _this._initPorts();
        return _this;
    }

    /**
    * @override
    */


    _createClass(AndroidMidiDevice, [{
        key: '_initPorts',
        value: function _initPorts() {

            var portInfos = this._midiDeviceInfo.getPorts(),
                logger = this._logger;

            this._ports = Array.from(portInfos).map(function (portInfo) {

                return portInfo.getType() === TYPE_INPUT ? new _AndroidMidiInputPort2.default({ portInfo: portInfo, logger: logger }) : new _AndroidMidiOutputPort2.default({ portInfo: portInfo, logger: logger });
            });
        }
    }, {
        key: 'name',
        get: function get() {
            return this._name;
        }

        /**
        * @override
        */

    }, {
        key: 'inputPorts',
        get: function get() {
            return this._ports.filter(function (port) {
                return port instanceof _AndroidMidiInputPort2.default;
            });
        }

        /**
        * @override
        */

    }, {
        key: 'outputPorts',
        get: function get() {
            return this._ports.filter(function (port) {
                return port instanceof _AndroidMidiOutputPort2.default;
            });
        }
    }]);

    return AndroidMidiDevice;
}(_MidiDevice3.default);

exports.default = AndroidMidiDevice;