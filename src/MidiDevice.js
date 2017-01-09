import { NotImplementedError } from './errors';

/**
* @property {string} name
*/
export default class MidiDevice {

    /**
    * @type {Array.<MidiInputPort>}
    */
    get inputPorts() {
        throw new NotImplementedError();
    }

    /**
    * @type {Array.<MidiOutputPort>}
    */
    get outputPorts() {
        throw new NotImplementedError();
    }

    /**
    * @callback midiMessageListener
    * @param {Array.<Uint8Array>} messages   - Array where each item is a Uint8Array containing a MIDI message.
    * @param {MidiOutputPort}  outputPort - Output port from which the bytes were received.
    */

    /**
    * Adds a listener that is invoked when any of the device's output ports sends a message.
    *
    * @param {midiMessageListener} messageListener
    */
    addMessageListener(messageListener) {

        if (typeof messageListener !== 'function') {
            throw new Error('messageListener must be a function');
        }

        if (this._globalMessageListeners.includes(messageListener)) {
            this._warn('Not device global MIDI message listener that has already been added.');
            return;
        }

        this._log('Adding device global MIDI message listener');
        this._globalMessageListeners.push(messageListener);
        this.outputPorts.forEach(port => port.addMessageListener(messageListener));
    }

    /**
    * Sends the given MIDI bytes to all of the device's input ports given a Uint8Array or NativeScript buffer containing
    * MIDI message bytes.
    *
    * @param   {Object}            options
    * @param   {Uin8Array}         [options.bytes]           - MIDI message bytes to send.
    *                                                          Required if `bytesReference` is not provided.
    * @param   {interop.Reference} [options.bytesReference]  - NativeScript reference to the buffer containing the MIDI message bytes to send.
    *                                                          Required if `bytes` is not provided
    * @param   {number}            [options.length]          - Number of bytes. Required if `bytesReference` is provided.
    * @returns {Promise}
    */
    send(options) {
        // Parameter validation is implemented in `port.send()`.
        return Promise.all(this.inputPorts.map(port => port.send(options)));
    }

    /*
    * Methods not part of the MidiDevice interface.
    */

    /**
    * @protected
    */
    _log(message, metadata) {
        this.logger.info(`${this.constructor.name}::${this.name}: ${message}`, metadata);
    }

    /**
    * @protected
    */
    _warn(message, metadata) {
        this.logger.warn(`${this.constructor.name}::${this.name}: ${message}`, metadata);
    }
}
