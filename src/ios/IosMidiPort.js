/* globals interop, MIDIEndointGetEntity, MIDIEntityGetDevice */

import { validate } from 'parameter-validator';
import { getDeviceRefForEndpointRef } from './ios-utils';

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
    */
    constructor(options) {

        let { connection } = validate(options, [ 'connection' ]);
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
}
