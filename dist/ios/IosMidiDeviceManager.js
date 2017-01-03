'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*globals PGMidi */


var _IosMidiDevice = require('./IosMidiDevice');

var _IosMidiDevice2 = _interopRequireDefault(_IosMidiDevice);

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
        this._devices = this._discoverDevices();
    }

    /**
    * The public property for accessing the available MIDI Devices.
    *
    * @property {Array.<MidiDevice>}
    */


    _createClass(IosMidiDeviceManager, [{
        key: 'addDeviceAddedListener',


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
        * Performs an initial search for available MIDI devices.
        *
        * @returns {Array.<MidiDevice>}
        */

    }, {
        key: '_discoverDevices',
        value: function _discoverDevices() {
            var _this = this;

            var midiDevices = Array.from(this._midiClient.sources).map(function (source) {
                return { source: source, name: source.name };
            });

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                var _loop = function _loop() {
                    var destination = _step.value;


                    var device = midiDevices.find(function (d) {
                        return d.name === destination.name;
                    });

                    if (device) {
                        device.destination = destination;
                    } else {
                        midiDevices.push({ destination: destination, name: destination.name });
                    }
                };

                for (var _iterator = this._midiClient.destinations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    _loop();
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

            return midiDevices.map(function (deviceInfo) {
                return new _IosMidiDevice2.default(Object.assign(deviceInfo, { logger: _this.logger }));
            });
        }

        /**
        * @param {PGMidi/PGMidiSource} source
        */

    }, {
        key: '_handleSourceAddedEvent',
        value: function _handleSourceAddedEvent(source) {

            this._log('Handling the "source added" event for the MIDI source \'' + source.name + '\'.');

            var name = source.name,
                existingDevice = this._devices.find(function (d) {
                return d.name === name;
            });


            if (existingDevice) {
                existingDevice.addSource(source);
                return this._notifyDeviceUpdated(existingDevice);
            }

            var newDevice = new _IosMidiDevice2.default({
                logger: this.logger,
                name: name,
                source: source
            });

            this._addDevice(newDevice);
        }

        /**
        * @param {PGMidi/PGMidiSource} source
        */

    }, {
        key: '_handleSourceRemovedEvent',
        value: function _handleSourceRemovedEvent(source) {

            this._log('Handling the "source removed" event for the MIDI source \'' + source.name + '\'.');

            var name = source.name,
                device = this._devices.find(function (d) {
                return d.name === name;
            });


            if (!device) {
                this._warn('Not removing MIDI source, because it matches no existing device.', { name: source.name });
                return;
            }

            if (device.isDestination) {
                // The device is still a destination, so just remove the source.
                device.removeSource();
                return this._notifyDeviceUpdated(device);
            }

            // The device is not a destination, either, so just remove it.
            this._removeDevice(device);
        }

        /**
        * @param {PGMidi/PGMidiDestination} destination
        */

    }, {
        key: '_handleDestinationAddedEvent',
        value: function _handleDestinationAddedEvent(destination) {

            this._log('Handling the "destination added" event for the MIDI destination \'' + destination.name + '\'.');

            var name = destination.name,
                existingDevice = this._devices.find(function (d) {
                return d.name === name;
            });


            if (existingDevice) {
                existingDevice.addDestination(destination);
                return this._notifyDeviceUpdated(existingDevice);
            }

            var newDevice = new _IosMidiDevice2.default({
                logger: this.logger,
                name: name,
                destination: destination
            });

            this._addDevice(newDevice);
        }

        /**
        * @param {PGMidi/PGMidiDestination} destination
        */

    }, {
        key: '_handleDestinationRemovedEvent',
        value: function _handleDestinationRemovedEvent(destination) {

            this._log('Handling the "destination removed" event for the MIDI destination \'' + destination.name + '\'.');

            var name = destination.name,
                device = this._devices.find(function (d) {
                return d.name === name;
            });


            if (!device) {
                this._warn('Not removing MIDI destination, because it matches no existing device.', { name: destination.name });
                return;
            }

            if (device.isSource) {
                // The device is still a source, so just remove the destination.
                device.removeDestination();
                return this._notifyDeviceUpdated(device);
            }

            // The device is not a destination, either, so just remove it.
            this._removeDevice(device);
        }
    }, {
        key: '_log',
        value: function _log(message, metadata) {
            this.logger.info(this.constructor.name + ': ' + message, metadata);
        }
    }, {
        key: '_warn',
        value: function _warn(message, metadata) {
            this.logger.warn(this.constructor.name + ': ' + message, metadata);
        }
    }, {
        key: '_notifyDeviceAdded',
        value: function _notifyDeviceAdded(device) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {

                for (var _iterator2 = this._deviceAddedListeners[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var callback = _step2.value;

                    try {
                        callback(device);
                    } catch (error) {
                        this.logger.error('A "device added" listener threw an error.', { error: error });
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
        key: '_notifyDeviceRemoved',
        value: function _notifyDeviceRemoved(device) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {

                for (var _iterator3 = this._deviceRemovedListeners[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var callback = _step3.value;

                    try {
                        callback(device);
                    } catch (error) {
                        this.logger.error('A "device removed" listener threw an error.', { error: error });
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
    }, {
        key: '_notifyDeviceUpdated',
        value: function _notifyDeviceUpdated(device) {
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {

                for (var _iterator4 = this._deviceUpdatedListeners[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var callback = _step4.value;

                    try {
                        callback(device);
                    } catch (error) {
                        this.logger.error('A "device updated" listener threw an error.', { error: error });
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }
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
    }, {
        key: '_validateEventListener',
        value: function _validateEventListener(callback) {

            if (typeof callback !== 'function') {
                throw new Error('The event listener must be a function.');
            }
        }
    }, {
        key: 'devices',
        get: function get() {
            return this._devices;
        }
    }]);

    return IosMidiDeviceManager;
}();

exports.default = IosMidiDeviceManager;