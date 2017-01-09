import { NotImplementedError } from './errors';

/**
* The input port of a MIDI device which provides a method by which an application can send MIDI messages to the device.
*/
export default class MidiInputPort  {

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
    * @abstract
    */
    send(/* options */) {

        return Promise.reject(new NotImplementedError());
    }
}
