/* globals NSObject, PGMidiSource, MIDIPacketList, interop, PGMidiSourceDelegate, SDMidiParser */
import { validate } from 'parameter-validator';
import { convertPointerToUint8Array } from 'nativescript-utilities';

const MidiMessageDelegate = NSObject.extend({

    /**
    * Handles an array of MIDI messages that were received.
    *
    * @interface midiMessageDelegateHandler
    * @param {Array.<Uint8Array>} messages - Array where each item is a Uint8Array containing a MIDI message.
    */

    /**
    * @param {Logger}                     logger
    * @param {midiMessageDelegateHandler} messageHandler
    */
    initWithOptions(logger, messageHandler) {

        let self = this.super.init();
        validate({ logger, messageHandler }, [ 'logger', 'messageHandler' ], this);
        this._midiParser = SDMidiParser.alloc().init();
        return self;
    },

    midiSourceMidiReceived(midiSource, packetList) {

        this._log('MIDI packetlist received.');
        let messages = this._parseMessagesFromPacketList(packetList);
        if (messages.length) {
            this.messageHandler(messages);
        }
    },

    /**
    * A MIDIPacketList can contain multiple messages or, in the case of a long SysEx message, it may contain
    * only a fragment of a message. This method collates packetLists to parse the received bytes into discreet,
    * validated MIDI messages and formats the messages into a simple, platform-agnostic binary format.
    *
    * @param   {CoreMidi/MIDIPacketList} packetList
    * @returns {Array.<Uint8Array>}      Array where each item is a Uint8Array containing the sanitized bytes
    *                                    for a single MIDI message.
    */
    _parseMessagesFromPacketList(packetList) {

        let messagesNsArray = this._midiParser.parsePacketList(packetList),
            nsDataMessages = Array.from(messagesNsArray);

        return nsDataMessages.map(({ bytes, length }) => convertPointerToUint8Array(bytes, length));
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
