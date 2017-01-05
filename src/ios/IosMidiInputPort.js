import { validate } from 'parameter-validator';

export default class IosMidiInputPort  {

    /**
    * @param {Object}                   options
    * @param {PGMidi/PGMidiDestination} options.destination
    * @param {Object}                   options.logger
    */
    constructor(options) {

        let { destination, logger } = validate(options, [ 'destination', 'logger' ]);
        super({ connection: destination });

        this._destination = destination;
        this._logger = logger;
    }

}
