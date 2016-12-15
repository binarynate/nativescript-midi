import ParameterValidator from 'parameter-validator';
import MidiDevice from './MidiDevice';
import MockLogger from './MockLogger';
import { MidiError } from './errors';

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
        .then(({ messageHandler }) => {

            if (this._source) {
                this.messageHandler = messageHandler;
                this._source.addDelegate(this);
            }
        });
    }

    /**
    * @param {Object}          options
    * @param {interop.Pointer} options.pointer - NativeScript pointer to the buffer containing the message
    * @param {number}          options.size  - Number of bytes
    */
    send(options) {

        return this.parameterValidator.validateAsync(options, [ 'pointer', 'size' ])
        .then(({ pointer, size }) => {

            if (!this._destination) {
                throw new MidiError(`Can't send a message to the MIDI device '${this.name}', because it's not a destination.`);
            }
            this._log(`Sending MIDI message bytes...`);
            this._destination.sendBytesSize(pointer, size);
            this._log(`Finished sending MIDI message bytes.`);
        });
    }

    /**
    * Implemented for the PGMidiSourceDelegate interface.
    *
    * @private
    */
    midiSourceMidiReceived(/* input, packetList */) {
        this.logger.info('MIDI packetlist received!');
    }

    _log(message, metadata) {
        this.logger.info(`${this.constructor.name}: ${message}`, metadata);
    }
}
