/* globals interop, MIDIEndointGetEntity, MIDIEntityGetDevice */

/**
* @param   {CoreMidi/MIDIEndpointRef} endpointRef
* @returns {CoreMidi/MIDIDeviceRef}
*/
export function getDeviceRefForEndpointRef(endpointRef) {

    let entityReference = new interop.Reference();
    MIDIEndointGetEntity(endpointRef, entityReference);

    let deviceReference = new interop.Reference();
    MIDIEntityGetDevice(entityReference.value, deviceReference);

    return deviceReference.value;
}
