import { validate, validateAsync } from 'parameter-validator';
import IosMidiPort from './IosMidiPort';

export default class IosMidiInputPort extends IosMidiPort  {

    /**
    * @param {Object}                   options
    * @param {PGMidi/PGMidiDestination} options.destination
    * @param {Object}                   options.logger
    */
    constructor(options) {

        let { destination, logger } = validate(options, [ 'destination', 'logger' ]);
        super({ connection: destination, logger });

        this._destination = destination;
    }

    /**
    * Sends the given MIDI bytes to the input port.
    *
    * @param {Object}            options
    * @param {interop.Reference} options.bytes  - NativeScript reference to the buffer containing the message
    * @param {number}            options.length - Number of bytes
    */
    send(options) {

        return validateAsync(options, [ 'bytes', 'length' ])
        .then(({ bytes, length }) => {

            this._log(`Sending MIDI message bytes...`);
            this._destination.sendBytesSize(bytes, length);
            this._log(`Finished sending MIDI message bytes.`);
        });
    }
}
