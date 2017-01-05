'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _parameterValidator = require('parameter-validator');

var _MidiDevice2 = require('../MidiDevice');

var _MidiDevice3 = _interopRequireDefault(_MidiDevice2);

var _MockLogger = require('../MockLogger');

var _MockLogger2 = _interopRequireDefault(_MockLogger);

var _IosMidiInputPort = require('./IosMidiInputPort');

var _IosMidiInputPort2 = _interopRequireDefault(_IosMidiInputPort);

var _IosMidiOutputPort = require('./IosMidiOutputPort');

var _IosMidiOutputPort2 = _interopRequireDefault(_IosMidiOutputPort);

var _IosMidiPort = require('./IosMidiPort');

var _IosMidiPort2 = _interopRequireDefault(_IosMidiPort);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
* @property {string}                 name
* @property {Object}                 ios           - Object exposing iOS-specific properties
* @property {CoreMidi/MIDIDeviceRef} ios.deviceRef
*/
var IosMidiDevice = function (_MidiDevice) {
    _inherits(IosMidiDevice, _MidiDevice);

    /**
    * @param {Object}              options
    * @param {string}              options.name
    * @param {Array.<IosMidiPort>} options.ports
    * @param {MIDIDeviceRef}       options.deviceRef
    * @param {Object}              [options.logger] - Optional logger that implements the Winston logging interface.
    */
    function IosMidiDevice(options) {
        _classCallCheck(this, IosMidiDevice);

        var _this = _possibleConstructorReturn(this, (IosMidiDevice.__proto__ || Object.getPrototypeOf(IosMidiDevice)).call(this, options));

        var _validate = (0, _parameterValidator.validate)(options, ['name', 'ports', 'deviceRef']),
            name = _validate.name,
            ports = _validate.ports,
            deviceRef = _validate.deviceRef;

        _this.name = name;
        _this.logger = options.logger || new _MockLogger2.default();
        _this.ios = { deviceRef: deviceRef };
        _this._ports = ports;
        _this._globalMessageListeners = []; // Message listeners that are invoked when any port receives a message.
        return _this;
    }

    /**
    * @type {Array.<IosMidiInputPort>}
    */


    _createClass(IosMidiDevice, [{
        key: 'addMessageListener',


        /**
        * @callback midiMessageListener
        * @param {Array.<Uint8Array>} messages   - Array where each item is a Uint8Array containing a MIDI message.
        * @param {IosMidiOutputPort}  outputPort - Output port from which the bytes were received.
        */

        /**
        * Adds a listener that is invoked when any of the device's output ports sends a message.
        *
        * @param {midiMessageListener} messageListener
        */
        value: function addMessageListener(messageListener) {

            if (typeof messageListener !== 'function') {
                throw new Error('messageListener must be a function');
            }

            if (this._globalMessageListeners.includes(messageListener)) {
                this._warn('Not device global MIDI message listener that has already been added.');
                return;
            }

            this._log('Adding device global MIDI message listener');
            this._globalMessageListeners.push(messageListener);
            this.outputPorts.forEach(function (port) {
                return port.addMessageListener(messageListener);
            });
        }

        /**
        * Sends the given MIDI bytes to all of the device's input ports.
        *
        * @param {Object}            options
        * @param {interop.Reference} options.bytes  - NativeScript reference to the buffer containing the message
        * @param {number}            options.length - Number of bytes
        */

    }, {
        key: 'send',
        value: function send(options) {
            var _this2 = this;

            return (0, _parameterValidator.validateAsync)(options, ['bytes', 'length']).then(function () {
                return Promise.all(_this2.inputPorts.map(function (port) {
                    return port.send(options);
                }));
            });
        }

        /*
        * Methods not part of the MidiDevice interface.
        */

        /**
        * @private
        * @param {IosMidiPort} port
        */

    }, {
        key: 'addPort',
        value: function addPort(port) {

            if (!(port instanceof _IosMidiPort2.default)) {
                this._warn('Not adding invalid MIDI input port.', { port: port });
                return;
            }
            var existingPort = this._ports.find(function (p) {
                return p.isSame(existingPort);
            });

            if (existingPort) {
                this._log('Not adding MIDI port that has already been added.', { port: port });
                return;
            }
            this._log('Adding MIDI port.', { port: port });
            this._ports.push(port);

            if (port instanceof _IosMidiOutputPort2.default) {
                // Attach all of the devices's global message handlers that have been registered.
                this._globalMessageListeners.forEach(function (listener) {
                    return port.addMessageListener(listener);
                });
            }
        }

        /**
        * @private
        * @param {IosMidiPort} port
        */

    }, {
        key: 'removePort',
        value: function removePort(port) {

            try {
                var index = this._ports.findIndex(function (p) {
                    return p.sameAs(port);
                });

                if (index === -1) {
                    this._warn('Not removing unrecognized MIDI port.', { port: port });
                    return;
                }
                this._log('Removing MIDI port.', { port: port });
                this._ports.splice(index, 1);
            } catch (error) {
                this._warn('Not removing invalid MIDI port.', { port: port, error: error });
            }
        }

        /**
        * @private Creates MidiDevice instances from the given PGMidi iOS MIDI client.
        *
        * @param {Object}                   options
        * @param {PGMidi/PGMidi}            options.midiClient
        * @param {Object}                   options.logger
        * @returns {Array.<IosMidiDevice>}
        */

    }, {
        key: '_log',
        value: function _log(message, metadata) {
            this.logger.info(this.constructor.name + '::' + this.name + ': ' + message, metadata);
        }
    }, {
        key: '_warn',
        value: function _warn(message, metadata) {
            this.logger.warn(this.constructor.name + '::' + this.name + ': ' + message, metadata);
        }
    }, {
        key: 'inputPorts',
        get: function get() {
            return this._ports.filter(function (p) {
                return p instanceof _IosMidiInputPort2.default;
            });
        }

        /**
        * @type {Array.<IosMidiOutputPort>}
        */

    }, {
        key: 'outputPorts',
        get: function get() {
            return this._ports.filter(function (p) {
                return p instanceof _IosMidiOutputPort2.default;
            });
        }
    }], [{
        key: 'parseDevices',
        value: function parseDevices(options) {
            var _validate2 = (0, _parameterValidator.validate)(options, ['midiClient', 'logger']),
                midiClient = _validate2.midiClient,
                logger = _validate2.logger;

            var allOutputPorts = Array.from(midiClient.sources).map(function (source) {
                return new _IosMidiOutputPort2.default({ source: source, logger: logger });
            }),
                allInputPorts = Array.from(midiClient.destinations).map(function (destination) {
                return new _IosMidiInputPort2.default({ destination: destination, logger: logger });
            }),
                allPorts = [].concat(_toConsumableArray(allOutputPorts), _toConsumableArray(allInputPorts));

            var deviceRefs = allPorts.map(function (port) {
                return port.ios.deviceRef;
            }),
                uniqueDeviceRefs = Array.from(new Set(deviceRefs));

            var devices = uniqueDeviceRefs.map(function (deviceRef) {

                var ports = allPorts.filter(function (p) {
                    return p.ios.deviceRef === deviceRef;
                });
                var name = ports[0].ios.endpointName;

                return new IosMidiDevice({ logger: logger, name: name, ports: ports, deviceRef: deviceRef });
            });
            return devices;
        }
    }]);

    return IosMidiDevice;
}(_MidiDevice3.default);

exports.default = IosMidiDevice;