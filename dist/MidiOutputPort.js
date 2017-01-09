'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _errors = require('./errors');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* The output of a MIDI device which notifies the application of messages received from the device.
*/
var MidiOutputPort = function () {
    function MidiOutputPort() {
        _classCallCheck(this, MidiOutputPort);
    }

    _createClass(MidiOutputPort, [{
        key: 'addMessageListener',


        /**
        * @callback midiMessageListener
        * @param {Array.<Uint8Array>} messages   - Array where each item is a Uint8Array containing a MIDI message.
        * @param {MidiOutputPort}  outputPort - Output port from which the bytes were received.
        */

        /**
        * Adds a listener that handles MIDI message received from the port.
        *
        * @param {midiMessageListener} messageListener - Callback that handles an incoming MIDI message from the port.
        * @abstract
        */
        value: function addMessageListener() /* messageListener */{

            throw new _errors.NotImplementedError();
        }
    }]);

    return MidiOutputPort;
}();

exports.default = MidiOutputPort;