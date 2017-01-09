'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MockLogger = require('./MockLogger');

var _MockLogger2 = _interopRequireDefault(_MockLogger);

var _errors = require('./errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MidiDeviceManager = function () {

    /**
    * @param {Object} [options]
    * @param {Object} [options.logger] - optional logger that implements the Winston logging
    *                                    interface.
    */
    function MidiDeviceManager() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, MidiDeviceManager);

        this.logger = options.logger || new _MockLogger2.default();

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


    _createClass(MidiDeviceManager, [{
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
        * @returns {Promise.<Array.<MidiDevice>>}
        * @abstract
        */

    }, {
        key: 'getDevices',
        value: function getDevices() {

            return Promise.reject(new _errors.NotImplementedError());
        }

        /**
        * Adds the given device to the device list and notifies listeners of the addition.
        *
        * @param {MidiDevice} device
        * @protected
        */

    }, {
        key: '_addDevice',
        value: function _addDevice(device) {

            this._devices.push(device);
            this._notifyDeviceAdded(device);
        }
    }, {
        key: '_log',
        value: function _log(message, metadata) {
            this.logger.info(this.constructor.name + ': ' + message, metadata);
        }

        /**
        * Notifies listeners that the given MIDI device has been added.
        *
        * @param {MidiDevice} device
        * @protected
        */

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

        /**
        * Notifies listeners that the given MIDI device has been removed.
        *
        * @param {MidiDevice} device
        * @protected
        */

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

        /**
        * Notifies listeners that the given MIDI device has been updated (e.g. removed port, etc).
        *
        * @param {MidiDevice} device
        * @protected
        */

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
        *
        * @param {MidiDevice} device
        * @protected
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
        key: '_warn',
        value: function _warn(message, metadata) {
            this.logger.warn(this.constructor.name + ': ' + message, metadata);
        }
    }]);

    return MidiDeviceManager;
}();

exports.default = MidiDeviceManager;