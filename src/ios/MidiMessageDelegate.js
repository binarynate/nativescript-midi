/* globals NSObject, PGMidiSource, MIDIPacketList, interop, PGMidiSourceDelegate, SDMidiUtils */
import { validate } from 'parameter-validator';

const MidiMessageDelegate = NSObject.extend({

    initWithOptions(logger, messageHandler) {

        let self = this.super.init();
        validate({ logger, messageHandler }, [ 'logger', 'messageHandler' ], this);
        return self;
    },

    midiSourceMidiReceived(midiSource, packetList) {

        this._log('MIDI packetlist received.');
        let bytes = this._convertPacketListToByteArray(packetList);
        this.messageHandler(bytes);
    },

    /**
    * @param   {MIDIPacketList} packetList
    * @returns {Uint8Array}     bytes
    */
    _convertPacketListToByteArray(packetList) {

        let midiPacketsNsArray = SDMidiUtils.convertPacketListToData(packetList),
            packets = convertNsArrayToArray(midiPacketsNsArray);

        let totalBytes = packets.reduce((total, packet) => total + packet.length, 0);

        let aggregatedBytes = new Uint8Array(totalBytes),
            aggregatedBytesIndex = 0;

        for (let packet of packets) {

            for (let packetByteIndex = 0; packetByteIndex < packet.length; packetByteIndex++) {

                let bytePointer = packet.bytes.add(packetByteIndex),
                    byteReference = new interop.Reference(interop.types.uint8, bytePointer);

                aggregatedBytes[aggregatedBytesIndex++] = byteReference.value;
            }
        }
        return aggregatedBytes;
    },

    _log(message, metadata) {
        this.logger.info(`MidiMessageDelegate: ${message}`, metadata);
    }

}, {
    protocols: [ PGMidiSourceDelegate ],
    exposedMethods: [
        {
            midiSourceMidiReceived: {
                returns: interop.types.void,
                params: [ PGMidiSource, new interop.types.ReferenceType(MIDIPacketList) ]
            }
        }
    ]
});

export default MidiMessageDelegate;

function convertNsArrayToArray(nsArray) {

    let array = [];

    for (let i = 0; i < nsArray.count; i++) {
        array.push(nsArray.objectAtIndex(i));
    }

    return array;
}
