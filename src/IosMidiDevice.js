import _ from 'lodash';
import ParameterValidator from 'parameter-validator';
import MidiDevice from './MidiDevice';
import { MidiError } from './errors';
import MockLogger from './MockLogger';

export default class IosMidiDevice extends MidiDevice {

    /**
    * @param {Object}            options
    * @param {string}            options.name
    * @param {PGMidiSource}      [options.source]      - Include if this device is a MIDI source
    * @param {PGMidiDestination} [options.destination] - Include if this device is a MIDI destination
    * @param {Object}            [options.logger]      - Optional logger that implements the Winston logging interface.
    */
    constructor(options) {

        this.parameterValidator.validate(options, [ 'name', [ 'source', 'destination' ]]);
        this.name = name;
        this._source = options.source;
        this._destination = options.destination;
        this.logger = options.logger || new MockLogger();
    }

    get isSource() {
        return !!this._source;
    }

    get isDestination() {
        return !!this._destination;
    }

    /**
    * Connects to the MIDI device in order to be able to receive messages from it.
    *
    * @param   {Object}   options
    * @param   {Function} options.messageHandler - Function that handles an incoming MIDI message
    * @returns {Promise}
    */
    connect(options) {

        return this.parameterValidator.validateAsync(options, [ 'messageHandler' ])
        .then(() => {

            if (this.source) {
                this.messageHandler = messageHandler;
                this.source.addDelegate(self);
            }
        });
    }

    send() {

    }

    /**
    * Implemented for the PGMidiSourceDelegate interface.
    *
    * @private
    */
    midiSourceMidiReceived(input, packetList) {
        this.logger.info('MIDI packetlist received!')
    }

}
