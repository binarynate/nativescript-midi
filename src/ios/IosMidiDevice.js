import ParameterValidator from 'parameter-validator';
import MidiDevice from '../MidiDevice';
import { MidiError } from '../errors';
import MockLogger from '../MockLogger';
import MidiMessageDelegate from './MidiMessageDelegate';

export default class IosMidiDevice extends MidiDevice {

    /**
    * @param {Object}            options
    * @param {string}            options.name
    * @param {PGMidiSource}      [options.source]      - Include if this device is a MIDI source
    * @param {PGMidiDestination} [options.destination] - Include if this device is a MIDI destination
    * @param {Object}            [options.logger]      - Optional logger that implements the Winston logging interface.
    */
    constructor(options) {

        super(options);
        this.parameterValidator = new ParameterValidator();
        this.parameterValidator.validate(options, [ 'name', [ 'source', 'destination' ]]);
        this.name = options.name;
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
        .then(({ messageHandler }) => {

            if (this._source) {

                this.logger.info(`Adding MIDI message delegate for device '${this.name}'...`);

                // Save a reference to the delegate so that it doesn't get garbage collected.
                this._midiMessageDelegate = MidiMessageDelegate.alloc().initWithOptions(this.logger, messageHandler);
                this._source.addDelegate(this._midiMessageDelegate);
                this.logger.info('MIDI message delegate added successfully.');
            }
        });
    }

    /**
    * @param {Object}            options
    * @param {interop.Reference} options.bytes  - NativeScript reference to the buffer containing the message
    * @param {number}            options.length - Number of bytes
    */
    send(options) {

        return this.parameterValidator.validateAsync(options, [ 'bytes', 'length' ])
        .then(({ bytes, length }) => {

            if (!this._destination) {
                throw new MidiError(`Can't send a message to the MIDI device '${this.name}', because it's not a destination.`);
            }

            this._log(`Sending MIDI message bytes...`);
            this._destination.sendBytesSize(bytes, length);
            this._log(`Finished sending MIDI message bytes.`);
        });
    }

    /*
    * Methods not part of the MidiDevice interface.
    */

    /**
    * Adds a PGMidiSource for the device.
    *
    * @param {PGMidi/PGMidiSource} source
    */
    addSource(source) {

        this._log('Adding MIDI source.');
        this._source = source;
    }

    /**
    * Removes the device's PGMidiSource.
    */
    removeSource() {

        this._log('Removing MIDI source.');
        delete this._source;
    }

    /**
    * Adds a PGMidiDestination for the device.
    *
    * @param {PGMidi/PGMidiDestination} destination
    */
    addDestination(destination) {

        this._log('Adding MIDI destination.');
        this._destination = destination;
    }

    /**
    * Removes the device's PGMidiDestination.
    */
    removeDestination() {

        this._log('Removing MIDI destination.');
        delete this._destination;
    }

    _log(message, metadata) {
        this.logger.info(`${this.constructor.name}::${this.name}: ${message}`, metadata);
    }
}
