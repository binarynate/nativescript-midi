'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _errors = require('./errors');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* A MIDI device with input ports and output ports through which communication occurs.
*/
var MidiDevice = function () {
    function MidiDevice() {
        _classCallCheck(this, MidiDevice);
    }

    _createClass(MidiDevice, [{
        key: 'addMessageListener',


        /**
        * @callback midiMessageListener
        * @param {Array.<Uint8Array>} messages   - Array where each item is a Uint8Array containing a MIDI message.
        * @param {MidiOutputPort}  outputPort - Output port from which the bytes were received.
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
        * Sends the given MIDI bytes to all of the device's input ports given a Uint8Array or NativeScript buffer containing
        * MIDI message bytes.
        *
        * @param   {Object}            options
        * @param   {Uin8Array}         [options.bytes]           - MIDI message bytes to send.
        *                                                          Required if `bytesReference` is not provided.
        * @param   {interop.Reference} [options.bytesReference]  - NativeScript reference to the buffer containing the MIDI message bytes to send.
        *                                                          Required if `bytes` is not provided
        * @param   {number}            [options.length]          - Number of bytes. Required if `bytesReference` is provided.
        * @returns {Promise}
        */

    }, {
        key: 'send',
        value: function send(options) {
            // Parameter validation is implemented in `port.send()`.
            return Promise.all(this.inputPorts.map(function (port) {
                return port.send(options);
            }));
        }

        /*
        * Methods not part of the MidiDevice interface.
        */

        /**
        * @protected
        * @private
        */

    }, {
        key: '_log',
        value: function _log(message, metadata) {
            this.logger.info(this.constructor.name + '::' + this.name + ': ' + message, metadata);
        }

        /**
        * @protected
        * @private
        */

    }, {
        key: '_warn',
        value: function _warn(message, metadata) {
            this.logger.warn(this.constructor.name + '::' + this.name + ': ' + message, metadata);
        }
    }, {
        key: 'name',


        /**
        * @type {string}
        */
        get: function get() {
            throw new _errors.NotImplementedError();
        }

        /**
        * @type {Array.<MidiInputPort>}
        */

    }, {
        key: 'inputPorts',
        get: function get() {
            throw new _errors.NotImplementedError();
        }

        /**
        * @type {Array.<MidiOutputPort>}
        */

    }, {
        key: 'outputPorts',
        get: function get() {
            throw new _errors.NotImplementedError();
        }
    }]);

    return MidiDevice;
}();

exports.default = MidiDevice;