'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DeviceEventType = undefined;

var _parameterValidator = require('parameter-validator');

var DeviceEventType = exports.DeviceEventType = {
    SOURCE_ADDED: 0,
    SOURCE_REMOVED: 1,
    DESTINATION_ADDED: 2,
    DESTINATION_REMOVED: 3
}; /* globals NSObject, PGMidiDelegate */


var MidiDeviceDelegate = NSObject.extend({

    /**
    * Handles a change in MIDI devices from the PGMidi module.
    *
    * @interface eventHandler
    * @param {DeviceEventType}                eventType
    * @param {PGMidiSource|PGMidiDestination} pgMidiDevice
    */

    /**
    * @param {Logger}       logger
    * @param {eventHandler} eventHandler
    */
    initWithOptions: function initWithOptions(logger, eventHandler) {

        var self = this.super.init();
        (0, _parameterValidator.validate)({ logger: logger, eventHandler: eventHandler }, ['logger', 'eventHandler'], this);
        return self;
    },


    /**
    * @param {PGMidi/PGMidi}       midi
    * @param {PGMidi/PGMidiSource} source
    */
    midiSourceAdded: function midiSourceAdded(midi, source) {

        this._log('MIDI source added.');
        this.eventHandler(DeviceEventType.SOURCE_ADDED, source);
    },


    /**
    * @param {PGMidi/PGMidi}       midi
    * @param {PGMidi/PGMidiSource} source
    */
    midiSourceRemoved: function midiSourceRemoved(midi, source) {

        this._log('MIDI source removed.');
        this.eventHandler(DeviceEventType.SOURCE_REMOVED, source);
    },


    /**
    * @param {PGMidi/PGMidi}       midi
    * @param {PGMidi/PGMidiDestination} destination
    */
    midiDestinationAdded: function midiDestinationAdded(midi, destination) {

        this._log('MIDI destination added.');
        this.eventHandler(DeviceEventType.DESTINATION_ADDED, destination);
    },


    /**
    * @param {PGMidi/PGMidi}       midi
    * @param {PGMidi/PGMidiDestination} destination
    */
    midiDestinationRemoved: function midiDestinationRemoved(midi, destination) {

        this._log('MIDI destination removed.');
        this.eventHandler(DeviceEventType.DESTINATION_REMOVED, destination);
    },
    _log: function _log(message, metadata) {
        this.logger.info(this.constructor.name + ': ' + message, metadata);
    }
}, { protocols: [PGMidiDelegate] });

exports.default = MidiDeviceDelegate;