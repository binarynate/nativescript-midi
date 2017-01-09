/* globals interop, MIDIEndpointGetEntity, MIDIEntityGetDevice */

import { validate } from 'parameter-validator';
import FunctionalMixin from '../utils/FunctionalMixin';

/**
* Mixin which implements functionality that is common to IosMidiInputPort and IosMidiOutputPort.
*
* @property {Object}                   ios             - Object exposing iOS-specific properties
* @property {CoreMidi/MIDIDeviceRef}   ios.deviceRef
* @property {CoreMidi/MIDIEndpointRef} ios.endpointRef
* @property {string}                   ios.endpointName
*/
const IosMidiPortMixin = FunctionalMixin({

    /**
    * @param {Object}                  options
    * @param {PGMidi/PGMidiConnection} options.connection
    * @param {Object}                  options.logger
    */
    init(options) {

        let { connection } = validate(options, [ 'connection', 'logger' ]);
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
    isSame(midiPort) {
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
    _getDeviceRefForEndpointRef(endpointRef) {

        let entityReference = new interop.Reference();
        MIDIEndpointGetEntity(endpointRef, entityReference);

        let deviceReference = new interop.Reference();
        MIDIEntityGetDevice(entityReference.value, deviceReference);

        return deviceReference.value;
    },

    /**
    * @protected
    */
    _log(message, metadata) {
        this.logger.info(`${this.constructor.name}::${this.ios.endpointName}::${this.ios.endpointRef}: ${message}`, metadata);
    },

    /**
    * @protected
    */
    _warn(message, metadata) {
        this.logger.warn(`${this.constructor.name}::${this.ios.endpointName}::${this.ios.endpointRef}: ${message}`, metadata);
    }
});

export default IosMidiPortMixin;
