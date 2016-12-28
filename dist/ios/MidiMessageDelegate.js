'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _parameterValidator = require('parameter-validator');

var _nativescriptUtilities = require('nativescript-utilities');

/* globals NSObject, PGMidiSource, MIDIPacketList, interop, PGMidiSourceDelegate, SDMidiParser */
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
            nsDataMessages = (0, _nativescriptUtilities.convertNSArrayToArray)(messagesNsArray);

        return nsDataMessages.map(function (_ref) {
            var bytes = _ref.bytes,
                length = _ref.length;
            return (0, _nativescriptUtilities.convertPointerToUint8Array)(bytes, length);
        });
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
});

exports.default = MidiMessageDelegate;