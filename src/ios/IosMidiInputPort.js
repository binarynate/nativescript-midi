import { validate } from 'parameter-validator';

export default class IosMidiInputPort  {

    /**
    * @param {Object}                   options
    * @param {PGMidi/PGMidiDestination} options.destination
    */
    constructor(options) {

        validate(options, [ 'destination' ], this);
        this._destination = options.destination;
    }

}
