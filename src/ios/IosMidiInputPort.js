import { validate, validateAsync } from 'parameter-validator';
import { convertUint8ArrayToReference } from 'nativescript-utilities';
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
    * Sends the given MIDI bytes to the input port given a Uint8Array or NativeScript buffer containing
    * MIDI message bytes.
    *
    * @param   {Object}            options
    * @param   {Uin8Array}         [options.bytes]           - MIDI message bytes to send to the device.
    *                                                          Required if `bytesReference` is not provided.
    * @param   {interop.Reference} [options.bytesReference]  - NativeScript reference to the buffer containing the MIDI message bytes to send.
    *                                                          Required if `bytes` is not provided
    * @param   {number}            [options.length]          - Number of bytes. Required if `bytesReference` is provided.
    * @returns {Promise}
    */
    send(options) {

        return validateAsync(options, [[ 'bytes', 'bytesReference' ]])
        .then(({ bytes, bytesReference }) => {

            let length;

            if (bytes) {
                length = bytes.length;
                bytesReference = convertUint8ArrayToReference(bytes);
            } else {
                ({ length } = validate(options, [ 'length' ]));
            }

            this._log(`Sending MIDI message bytes...`);
            this._destination.sendBytesSize(bytesReference, length);
            this._log(`Finished sending MIDI message bytes.`);
        });
    }
}
