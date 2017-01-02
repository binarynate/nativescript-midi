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
    * Handles a change in a MIDI source from the PGMidi module.
    *
    * @interface midiSourceEventHandler
    * @param {PGMidiSource} source
    */

    /**
    * Handles a change in a MIDI destination from the PGMidi module.
    *
    * @interface midiDestinationEventHandler
    * @param {PGMidiDestination} destination
    */

    /**
    * @param {Logger}                      logger
    * @param {midiSourceEventHandler}      sourceAddedHandler
    * @param {midiSourceEventHandler}      sourceRemovedHandler
    * @param {midiDestinationEventHandler} destinationAddedHandler
    * @param {midiDestinationEventHandler} destinationRemovedHandler
    */
    initWithOptions: function initWithOptions(logger, sourceAddedHandler, sourceRemovedHandler, destinationAddedHandler, destinationRemovedHandler) {

        var self = this.super.init();
        (0, _parameterValidator.validate)({
            logger: logger,
            sourceAddedHandler: sourceAddedHandler,
            sourceRemovedHandler: sourceRemovedHandler,
            destinationAddedHandler: destinationAddedHandler,
            destinationRemovedHandler: destinationRemovedHandler
        }, ['logger', 'sourceAddedHandler', 'sourceRemovedHandler', 'destinationAddedHandler', 'destinationRemovedHandler'], this);
        return self;
    },


    /**
    * @param {PGMidi/PGMidi}       midi
    * @param {PGMidi/PGMidiSource} source
    */
    midiSourceAdded: function midiSourceAdded(midi, source) {

        this._log('MIDI source added.');
        this.sourceAddedHandler(source);
    },


    /**
    * @param {PGMidi/PGMidi}       midi
    * @param {PGMidi/PGMidiSource} source
    */
    midiSourceRemoved: function midiSourceRemoved(midi, source) {

        this._log('MIDI source removed.');
        this.sourceRemovedHandler(source);
    },


    /**
    * @param {PGMidi/PGMidi}       midi
    * @param {PGMidi/PGMidiDestination} destination
    */
    midiDestinationAdded: function midiDestinationAdded(midi, destination) {

        this._log('MIDI destination added.');
        this.destinationAddedHandler(destination);
    },


    /**
    * @param {PGMidi/PGMidi}       midi
    * @param {PGMidi/PGMidiDestination} destination
    */
    midiDestinationRemoved: function midiDestinationRemoved(midi, destination) {

        this._log('MIDI destination removed.');
        this.destinationRemovedHandler(destination);
    },
    _log: function _log(message, metadata) {
        this.logger.info(this.constructor.name + ': ' + message, metadata);
    }
}, { protocols: [PGMidiDelegate] });

exports.default = MidiDeviceDelegate;