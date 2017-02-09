'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _parameterValidator = require('parameter-validator');

var _FunctionalMixin = require('../utils/FunctionalMixin');

var _FunctionalMixin2 = _interopRequireDefault(_FunctionalMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* Mixin which implements functionality that is common to IosMidiInputPort and IosMidiOutputPort.
*
* @property {Object}                   ios             - Object exposing iOS-specific properties
* @property {CoreMidi/MIDIDeviceRef}   ios.deviceRef
* @property {CoreMidi/MIDIEndpointRef} ios.endpointRef
* @property {string}                   ios.endpointName
*/
/* globals interop, MIDIEndpointGetEntity, MIDIEntityGetDevice */
var IosMidiPortMixin = (0, _FunctionalMixin2.default)({

    /**
    * @param {Object}                  options
    * @param {PGMidi/PGMidiConnection} options.connection
    * @param {Object}                  options.logger
    */
    init: function init(options) {
        var _validate = (0, _parameterValidator.validate)(options, ['connection', 'logger']),
            connection = _validate.connection;

        this.logger = options.logger;
        this.ios = {};
        this.ios.endpointRef = connection.endpoint;
        this.ios.deviceRef = this._getDeviceRefForEndpointRef(connection.endpoint);
        this.ios.endpointName = connection.name;
    },


    /**
    * @private Indicates whether the given port object represents the same port.
    *
    * @param   {IosMidiPort} midiPort
    * @returns {boolean}
    */
    isSame: function isSame(midiPort) {
        try {
            return midiPort.ios.endpointRef === this.ios.endpointRef;
        } catch (error) {
            return false;
        }
    },


    /**
    * @param   {CoreMidi/MIDIEndpointRef} endpointRef
    * @returns {CoreMidi/MIDIDeviceRef}
    */
    _getDeviceRefForEndpointRef: function _getDeviceRefForEndpointRef(endpointRef) {

        var entityReference = new interop.Reference();
        MIDIEndpointGetEntity(endpointRef, entityReference);

        var deviceReference = new interop.Reference();
        MIDIEntityGetDevice(entityReference.value, deviceReference);

        return deviceReference.value;
    },


    /**
    * @protected
    */
    _log: function _log(message, metadata) {
        this.logger.info(this.constructor.name + '::' + this.ios.endpointName + '::' + this.ios.endpointRef + ': ' + message, metadata);
    },


    /**
    * @protected
    */
    _warn: function _warn(message, metadata) {
        this.logger.warn(this.constructor.name + '::' + this.ios.endpointName + '::' + this.ios.endpointRef + ': ' + message, metadata);
    }
});

exports.default = IosMidiPortMixin;