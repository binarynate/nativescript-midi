'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _parameterValidator = require('parameter-validator');

var MidiMessageDelegate = NSObject.extend({

    /**
    * Handles an array of MIDI messages that were received.
    *
    * @interface messageHandler
    * @param {Array.<Uint8Array>} messages
    */

    /**
    * @param {Logger}         logger
    * @param {messageHandler} messageHandler
    */
    initWithOptions: function initWithOptions(logger, messageHandler) {

        var self = this.super.init();
        (0, _parameterValidator.validate)({ logger: logger, messageHandler: messageHandler }, ['logger', 'messageHandler'], this);
        this._midiParser = SDMidiParser.alloc().init();
        return self;
    },
    midiSourceMidiReceived: function midiSourceMidiReceived(midiSource, packetList) {

        this._log('MIDI packetlist received.');
        var messages = this._parseMessagesFromPacketList(packetList);
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
    _parseMessagesFromPacketList: function _parseMessagesFromPacketList(packetList) {

        var messagesNsArray = this._midiParser.parsePacketList(packetList),
            nsDataMessages = convertNsArrayToArray(messagesNsArray);

        var formattedMessages = nsDataMessages.map(function (nsDataMessage) {

            var formattedMessage = Uint8Array(nsDataMessage.length);

            for (var byteIndex = 0; byteIndex < nsDataMessage.length; byteIndex++) {

                var bytePointer = nsDataMessage.bytes.add(byteIndex),
                    byteReference = new interop.Reference(interop.types.uint8, bytePointer);

                formattedMessage[byteIndex] = byteReference.value;
            }
        });

        return formattedMessages;
    },
    _log: function _log(message, metadata) {
        this.logger.info('MidiMessageDelegate: ' + message, metadata);
    }
}, {
    protocols: [PGMidiSourceDelegate],
    exposedMethods: [{
        midiSourceMidiReceived: {
            returns: interop.types.void,
            params: [PGMidiSource, new interop.types.ReferenceType(MIDIPacketList)]
        }
    }]
}); /* globals NSObject, PGMidiSource, MIDIPacketList, interop, PGMidiSourceDelegate, SDMidiParser */
exports.default = MidiMessageDelegate;


function convertNsArrayToArray(nsArray) {

    var array = [];

    for (var i = 0; i < nsArray.count; i++) {
        array.push(nsArray.objectAtIndex(i));
    }

    return array;
}