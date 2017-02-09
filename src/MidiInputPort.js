import { NotImplementedError } from './errors';

/**
* The input port of a MIDI device which provides a method by which an application can send MIDI messages to the device.
*/
class MidiInputPort  {

    /**
    * Sends the given MIDI bytes to the input port given a Uint8Array or NativeScript buffer containing
    * MIDI message bytes.
    *
    * @param   {Object}    options
    * @param   {Uin8Array} options.bytes - MIDI message bytes to send to the device.
    * @returns {Promise}
    * @abstract
    */
    send(/* options */) {

        return Promise.reject(new NotImplementedError());
    }
}

export default MidiInputPort;
