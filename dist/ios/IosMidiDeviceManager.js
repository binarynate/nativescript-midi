'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MidiDeviceManager2 = require('../MidiDeviceManager');

var _MidiDeviceManager3 = _interopRequireDefault(_MidiDeviceManager2);

var _IosMidiDevice = require('./IosMidiDevice');

var _IosMidiDevice2 = _interopRequireDefault(_IosMidiDevice);

var _IosMidiOutputPort = require('./IosMidiOutputPort');

var _IosMidiOutputPort2 = _interopRequireDefault(_IosMidiOutputPort);

var _IosMidiInputPort = require('./IosMidiInputPort');

var _IosMidiInputPort2 = _interopRequireDefault(_IosMidiInputPort);

var _MidiDeviceDelegate = require('./MidiDeviceDelegate');

var _MidiDeviceDelegate2 = _interopRequireDefault(_MidiDeviceDelegate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* globals PGMidi */


var IosMidiDeviceManager = function (_MidiDeviceManager) {
    _inherits(IosMidiDeviceManager, _MidiDeviceManager);

    /**
    * @param {Object} [options]
    * @param {Object} [options.logger] - optional logger that implements the Winston logging
    *                                    interface.
    * @override
    */
    function IosMidiDeviceManager() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, IosMidiDeviceManager);

        var _this = _possibleConstructorReturn(this, (IosMidiDeviceManager.__proto__ || Object.getPrototypeOf(IosMidiDeviceManager)).call(this, options));

        _this._midiClient = new PGMidi();
        _this._midiClient.networkEnabled = true;
        _this._midiClient.virtualDestinationEnabled = true;
        _this._midiClient.virtualSourceEnabled = true;

        // It's necessary to reference this delegate directly from this JS class so that it doesn't get
        // garbage collected.
        _this._midiDeviceDelegate = _MidiDeviceDelegate2.default.alloc().initWithOptions(_this.logger, _this._handleSourceAddedEvent.bind(_this), _this._handleSourceRemovedEvent.bind(_this), _this._handleDestinationAddedEvent.bind(_this), _this._handleDestinationRemovedEvent.bind(_this));

        _this._midiClient.delegate = _this._midiDeviceDelegate;
        return _this;
    }

    /**
    * Gets the available MIDI devices.
    *
    * @returns {Promise.<Array.<IosMidiDevice>>}
    * @override
    */


    _createClass(IosMidiDeviceManager, [{
        key: 'getDevices',
        value: function getDevices() {
            var _this2 = this;

            return Promise.resolve().then(function () {

                if (_this2._devices) {
                    return _this2._devices;
                }

                _this2._devices = _IosMidiDevice2.default.parseDevices({
                    logger: _this2.logger,
                    midiClient: _this2._midiClient
                });

                return _this2._devices;
            });
        }

        /**
        * @param {IosMidiPort} port
        * @private
        */

    }, {
        key: '_addPort',
        value: function _addPort(port) {

            var deviceRef = port.ios.deviceRef;
            var existingDevice = this._devices.find(function (device) {
                return device.ios.deviceRef === deviceRef;
            });

            if (existingDevice) {

                existingDevice.addPort(port);
                return this._notifyDeviceUpdated(existingDevice);
            }

            var newDevice = new _IosMidiDevice2.default({
                logger: this.logger,
                name: port.ios.endpointName,
                ports: [port],
                deviceRef: deviceRef
            });

            this._addDevice(newDevice);
        }

        /**
        * @param {PGMidi/PGMidiSource} source
        * @private
        */

    }, {
        key: '_handleSourceAddedEvent',
        value: function _handleSourceAddedEvent(source) {

            this._log('Handling the "source added" event for the MIDI source \'' + source.name + '\'.');

            var port = new _IosMidiOutputPort2.default({ logger: this.logger, source: source });
            this._addPort(port);
        }

        /**
        * @param {PGMidi/PGMidiSource} source
        * @private
        */

    }, {
        key: '_handleSourceRemovedEvent',
        value: function _handleSourceRemovedEvent(source) {

            this._log('Handling the "source removed" event for the MIDI source \'' + source.name + '\'.');

            var port = new _IosMidiOutputPort2.default({ logger: this.logger, source: source });
            this._removePort(port);
        }

        /**
        * @param {PGMidi/PGMidiDestination} destination
        * @private
        */

    }, {
        key: '_handleDestinationAddedEvent',
        value: function _handleDestinationAddedEvent(destination) {

            this._log('Handling the "destination added" event for the MIDI destination \'' + destination.name + '\'.');

            var port = new _IosMidiInputPort2.default({ logger: this.logger, destination: destination });
            this._addPort(port);
        }

        /**
        * @param {PGMidi/PGMidiDestination} destination
        * @private
        */

    }, {
        key: '_handleDestinationRemovedEvent',
        value: function _handleDestinationRemovedEvent(destination) {

            this._log('Handling the "destination removed" event for the MIDI destination \'' + destination.name + '\'.');

            var port = new _IosMidiInputPort2.default({ logger: this.logger, destination: destination });
            this._removePort(port);
        }

        /**
        * @param {IosMidiPort} port
        * @private
        */

    }, {
        key: '_removePort',
        value: function _removePort(port) {

            var device = this._devices.find(function (d) {
                return d.ios.deviceRef === port.ios.deviceRef;
            });

            if (!device) {
                this._warn('Not removing MIDI port, because it matches no existing device.', { port: port });
                return;
            }

            device.removePort(port);

            if (device.inputPorts.length || device.outputPorts.length) {
                // This device still has ports left, so just notify that it was updated, but don't remove it.
                return this._notifyDeviceUpdated(device);
            }

            // The device has no ports left, so remove it.
            this._removeDevice(device);
        }
    }]);

    return IosMidiDeviceManager;
}(_MidiDeviceManager3.default);

exports.default = IosMidiDeviceManager;