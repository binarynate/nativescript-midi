import _ from 'lodash';
import ParameterValidator from 'parameter-validator';

/**
* @property {string}  name
* @property {boolean} isSource
* @property {boolean} isDestination
*/
export default class MidiDevice {

    /**
    * @param {Object} options
    * @param {string} options.name
    */
    constructor(options = {}) {

        this.parameterValidator = new ParameterValidator();
        Object.assign(this, _.pick(options, [
            'name',
            'isSource',
            'isDestination'
        ]));
    }

    /**
    * Connects to the MIDI device in order to be able to receive messages from it.
    *
    * @param   {Object}   options
    * @param   {Function} options.messageHandler - Function that handles an incoming MIDI message
    * @returns {Promise}
    */
    connect(options) {

        return this.parameterValidator.validateAsync(options, [ 'messageHandler' ]);
    }
}
