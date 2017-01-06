'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*globals PGMidi */
/* jshint browser: false */


var _IosMidiDevice = require('./IosMidiDevice');

var _IosMidiDevice2 = _interopRequireDefault(_IosMidiDevice);

var _IosMidiOutputPort = require('./IosMidiOutputPort');

var _IosMidiOutputPort2 = _interopRequireDefault(_IosMidiOutputPort);

var _IosMidiInputPort = require('./IosMidiInputPort');

var _IosMidiInputPort2 = _interopRequireDefault(_IosMidiInputPort);

var _MidiDeviceDelegate = require('./MidiDeviceDelegate');

var _MidiDeviceDelegate2 = _interopRequireDefault(_MidiDeviceDelegate);

var _MockLogger = require('../MockLogger');

var _MockLogger2 = _interopRequireDefault(_MockLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IosMidiDeviceManager = function () {

    /**
    * @param {Object} [options]
    * @param {Object} [options.logger] - optional logger that implements the Winston logging
    *                                    interface.
    */
    function IosMidiDeviceManager() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, IosMidiDeviceManager);

        this.logger = options.logger || new _MockLogger2.default();
        this._midiClient = new PGMidi();
        this._midiClient.networkEnabled = true;
        this._midiClient.virtualDestinationEnabled = true;
        this._midiClient.virtualSourceEnabled = true;

        // It's necessary to reference this delegate directly from this JS class so that it doesn't get
        // garbage collected.
        this._midiDeviceDelegate = _MidiDeviceDelegate2.default.alloc().initWithOptions(this.logger, this._handleSourceAddedEvent.bind(this), this._handleSourceRemovedEvent.bind(this), this._handleDestinationAddedEvent.bind(this), this._handleDestinationRemovedEvent.bind(this));

        this._midiClient.delegate = this._midiDeviceDelegate;
        this._deviceAddedListeners = [];
        this._deviceRemovedListeners = [];
        this._deviceUpdatedListeners = [];
    }

    /**
    * A callback that responds to a device change event.
    *
    * @callback deviceEventCallback
    * @param {MidiDevice}
    */

    /**
    * Registers a callback that is invoked when a device is added.
    *
    * @param {deviceEventCallback} callback
    */


    _createClass(IosMidiDeviceManager, [{
        key: 'addDeviceAddedListener',
        value: function addDeviceAddedListener(callback) {

            this._validateEventListener(callback);

            if (!this._deviceAddedListeners.includes(callback)) {
                this._deviceAddedListeners.push(callback);
            }
        }

        /**
        * Registers a callback that is invoked when a device is removed.
        *
        * @param {deviceEventCallback} callback
        */

    }, {
        key: 'addDeviceRemovedListener',
        value: function addDeviceRemovedListener(callback) {

            this._validateEventListener(callback);

            if (!this._deviceRemovedListeners.includes(callback)) {
                this._deviceRemovedListeners.push(callback);
            }
        }

        /**
        * Registers a callback that is invoked when a device is updated.
        *
        * An example of an update is that a device that wasn't previously a MIDI source (i.e. was only
        * a destination) becomes a MIDI source.
        *
        * @param {deviceEventCallback} callback
        */

    }, {
        key: 'addDeviceUpdatedListener',
        value: function addDeviceUpdatedListener(callback) {

            this._validateEventListener(callback);

            if (!this._deviceUpdatedListeners.includes(callback)) {
                this._deviceUpdatedListeners.push(callback);
            }
        }

        /**
        * Gets the available MIDI devices.
        *
        * @returns {Promise.<Array.<IosMidiDevice>>}
        */

    }, {
        key: 'getDevices',
        value: function getDevices() {
            var _this = this;

            return Promise.resolve().then(function () {

                if (_this._devices) {
                    return _this._devices;
                }

                _this._devices = _IosMidiDevice2.default.parseDevices({
                    logger: _this.logger,
                    midiClient: _this._midiClient
                });

                return _this._devices;
            });
        }

        /**
        * Adds the given device to the device list and notifies listeners of the addition.
        */

    }, {
        key: '_addDevice',
        value: function _addDevice(device) {

            this._devices.push(device);
            this._notifyDeviceAdded(device);
        }

        /**
        * @param {IosMidiPort} port
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
        */

    }, {
        key: '_handleDestinationRemovedEvent',
        value: function _handleDestinationRemovedEvent(destination) {

            this._log('Handling the "destination removed" event for the MIDI destination \'' + destination.name + '\'.');

            var port = new _IosMidiInputPort2.default({ logger: this.logger, destination: destination });
            this._removePort(port);
        }
    }, {
        key: '_log',
        value: function _log(message, metadata) {
            this.logger.info(this.constructor.name + ': ' + message, metadata);
        }
    }, {
        key: '_notifyDeviceAdded',
        value: function _notifyDeviceAdded(device) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {

                for (var _iterator = this._deviceAddedListeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var callback = _step.value;

                    try {
                        callback(device);
                    } catch (error) {
                        this.logger.error('A "device added" listener threw an error.', { error: error });
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
        }
    }, {
        key: '_notifyDeviceRemoved',
        value: function _notifyDeviceRemoved(device) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {

                for (var _iterator2 = this._deviceRemovedListeners[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var callback = _step2.value;

                    try {
                        callback(device);
                    } catch (error) {
                        this.logger.error('A "device removed" listener threw an error.', { error: error });
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
        key: '_notifyDeviceUpdated',
        value: function _notifyDeviceUpdated(device) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {

                for (var _iterator3 = this._deviceUpdatedListeners[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var callback = _step3.value;

                    try {
                        callback(device);
                    } catch (error) {
                        this.logger.error('A "device updated" listener threw an error.', { error: error });
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }

        /**
        * Removes the given device from the device list and notifies listeners of the removal.
        */

    }, {
        key: '_removeDevice',
        value: function _removeDevice(device) {

            this._log('Removing device \'' + device.name + '\'.');
            var index = this._devices.indexOf(device);
            this._devices.splice(index, 1);
            this._notifyDeviceRemoved(device);
        }

        /**
        * @param {IosMidiPort} port
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
    }, {
        key: '_validateEventListener',
        value: function _validateEventListener(callback) {

            if (typeof callback !== 'function') {
                throw new Error('The event listener must be a function.');
            }
        }
    }, {
        key: '_warn',
        value: function _warn(message, metadata) {
            this.logger.warn(this.constructor.name + ': ' + message, metadata);
        }
    }]);

    return IosMidiDeviceManager;
}();

exports.default = IosMidiDeviceManager;