/* globals interop, MIDIEndointGetEntity, MIDIEntityGetDevice */

import { validate } from 'parameter-validator';

/**
* @property {Object}                   ios             - Object exposing iOS-specific properties
* @property {CoreMidi/MIDIDeviceRef}   ios.deviceRef
* @property {CoreMidi/MIDIEndpointRef} ios.endpointRef
* @property {string}                   ios.endpointName
*/
export default class IosMidiPort {

    /**
    * @param {Object}                  options
    * @param {PGMidi/PGMidiConnection} options.connection
    * @param {Object}                  options.logger
    */
    constructor(options) {

        let { connection } = validate(options, [ 'connection', 'logger' ]);
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
    isSame(midiPort) {
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
    _getDeviceRefForEndpointRef(endpointRef) {

        let entityReference = new interop.Reference();
        MIDIEndointGetEntity(endpointRef, entityReference);

        let deviceReference = new interop.Reference();
        MIDIEntityGetDevice(entityReference.value, deviceReference);

        return deviceReference.value;
    }

    /**
    * @internal
    */
    _log(message, metadata) {
        this.logger.info(`${this.constructor.name}::${this.ios.endpointName}::${this.ios.endpointRef}: ${message}`, metadata);
    }

    /**
    * @internal
    */
    _warn(message, metadata) {
        this.logger.warn(`${this.constructor.name}::${this.ios.endpointName}::${this.ios.endpointRef}: ${message}`, metadata);
    }
}
