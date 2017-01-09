'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _errors = require('./errors');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* The input port of a MIDI device which provides a method by which an application can send MIDI messages to the device.
*/
var MidiInputPort = function () {
    function MidiInputPort() {
        _classCallCheck(this, MidiInputPort);
    }

    _createClass(MidiInputPort, [{
        key: 'send',


        /**
        * Sends the given MIDI bytes to the input port given a Uint8Array or NativeScript buffer containing
        * MIDI message bytes.
        *
        * @param   {Object}            options
        * @param   {Uin8Array}         [options.bytes]           - MIDI message bytes to send to the device.
        *                                                          Required if `bytesReference` is not provided.
        * @param   {interop.Reference} [options.bytesReference]  - NativeScript reference to the buffer containing the MIDI message bytes to send.
        *                                                          Required if `bytes` is not provided
        * @param   {number}            [options.length]          - Number of bytes. Required if `bytesReference` is provided.
        * @returns {Promise}
        * @abstract
        */
        value: function send() /* options */{

            return Promise.reject(new _errors.NotImplementedError());
        }
    }]);

    return MidiInputPort;
}();

exports.default = MidiInputPort;