'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _parameterValidator = require('parameter-validator');

var MidiMessageDelegate = NSObject.extend({
    initWithOptions: function initWithOptions(logger, messageHandler) {

        var self = this.super.init();
        (0, _parameterValidator.validate)({ logger: logger, messageHandler: messageHandler }, ['logger', 'messageHandler'], this);
        return self;
    },
    midiSourceMidiReceived: function midiSourceMidiReceived(midiSource, packetList) {

        this._log('MIDI packetlist received.');
        var bytes = this._convertPacketListToByteArray(packetList);
        this.messageHandler(bytes);
    },


    /**
    * @param   {MIDIPacketList} packetList
    * @returns {Uint8Array}     bytes
    */
    _convertPacketListToByteArray: function _convertPacketListToByteArray(packetList) {

        var midiPacketsNsArray = SDMidiUtils.convertPacketListToData(packetList),
            packets = convertNsArrayToArray(midiPacketsNsArray);

        var totalBytes = packets.reduce(function (total, packet) {
            return total + packet.length;
        }, 0);

        var aggregatedBytes = new Uint8Array(totalBytes),
            aggregatedBytesIndex = 0;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = packets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var packet = _step.value;


                for (var packetByteIndex = 0; packetByteIndex < packet.length; packetByteIndex++) {

                    var bytePointer = packet.bytes.add(packetByteIndex),
                        byteReference = new interop.Reference(interop.types.uint8, bytePointer);

                    aggregatedBytes[aggregatedBytesIndex++] = byteReference.value;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return aggregatedBytes;
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
}); /* globals NSObject, PGMidiSource, MIDIPacketList, interop, PGMidiSourceDelegate, SDMidiUtils */
exports.default = MidiMessageDelegate;


function convertNsArrayToArray(nsArray) {

    var array = [];

    for (var i = 0; i < nsArray.count; i++) {
        array.push(nsArray.objectAtIndex(i));
    }

    return array;
}