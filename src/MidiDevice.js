import { validate } from 'parameter-validator';
import { NotImplementedError } from './errors';

/**
* A MIDI device with input ports and output ports through which communication occurs.
*/
class MidiDevice {

    constructor(options) {

        validate(options, [ 'logger' ], this, { addPrefix: '_' });
        this._globalMessageListeners = []; // Message listeners that are invoked when any port receives a message.
    }

    /**
    * @type {string}
    */
    get name() {
        throw new NotImplementedError();
    }

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
    * @param   {Uin8Array}         options.bytes - MIDI message bytes to send.
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
    * @private
    */
    _log(message, metadata) {
        this._logger.info(`${this.constructor.name}::${this.name}: ${message}`, metadata);
    }

    /**
    * @protected
    * @private
    */
    _warn(message, metadata) {
        this._logger.warn(`${this.constructor.name}::${this.name}: ${message}`, metadata);
    }
}

export default MidiDevice;
