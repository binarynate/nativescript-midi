import { validate } from 'parameter-validator';

export default class IosMidiOutputPort {

    /**
    * @param {Object}                   options
    * @param {PGMidi/PGMidiDestination} options.destination
    */
    constructor(options) {

        validate(options, [ 'destination' ]);
        this._destination = destination;
    }

}
