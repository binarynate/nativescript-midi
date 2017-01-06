'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* globals interop, MIDIEndpointGetEntity, MIDIEntityGetDevice */

var _parameterValidator = require('parameter-validator');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* @property {Object}                   ios             - Object exposing iOS-specific properties
* @property {CoreMidi/MIDIDeviceRef}   ios.deviceRef
* @property {CoreMidi/MIDIEndpointRef} ios.endpointRef
* @property {string}                   ios.endpointName
*/
var IosMidiPort = function () {

    /**
    * @param {Object}                  options
    * @param {PGMidi/PGMidiConnection} options.connection
    * @param {Object}                  options.logger
    */
    function IosMidiPort(options) {
        _classCallCheck(this, IosMidiPort);

        var _validate = (0, _parameterValidator.validate)(options, ['connection', 'logger']),
            connection = _validate.connection;

        this.logger = options.logger;
        this.ios = {};
        this.ios.endpointRef = connection.endpoint;
        this.ios.deviceRef = this._getDeviceRefForEndpointRef(connection.endpoint);
        this.ios.endpointName = connection.name;
    }

    /**
    * @private Indicates whether the given port object represents the same port.
    *
    * @param   {IosMidiPort} midiPort
    * @returns {boolean}
    */


    _createClass(IosMidiPort, [{
        key: 'isSame',
        value: function isSame(midiPort) {
            try {
                return midiPort.ios.endpointRef === this.ios.endpointRef;
            } catch (error) {
                return false;
            }
        }

        /**
        * @param   {CoreMidi/MIDIEndpointRef} endpointRef
        * @returns {CoreMidi/MIDIDeviceRef}
        */

    }, {
        key: '_getDeviceRefForEndpointRef',
        value: function _getDeviceRefForEndpointRef(endpointRef) {

            var entityReference = new interop.Reference();
            MIDIEndpointGetEntity(endpointRef, entityReference);

            var deviceReference = new interop.Reference();
            MIDIEntityGetDevice(entityReference.value, deviceReference);

            return deviceReference.value;
        }

        /**
        * @internal
        */

    }, {
        key: '_log',
        value: function _log(message, metadata) {
            this.logger.info(this.constructor.name + '::' + this.ios.endpointName + '::' + this.ios.endpointRef + ': ' + message, metadata);
        }

        /**
        * @internal
        */

    }, {
        key: '_warn',
        value: function _warn(message, metadata) {
            this.logger.warn(this.constructor.name + '::' + this.ios.endpointName + '::' + this.ios.endpointRef + ': ' + message, metadata);
        }
    }]);

    return IosMidiPort;
}();

exports.default = IosMidiPort;