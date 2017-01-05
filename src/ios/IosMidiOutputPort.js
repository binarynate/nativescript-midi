import { validate } from 'parameter-validator';

export default class IosMidiOutputPort {

    /**
    * @param {Object}              options
    * @param {PGMidi/PGMidiSource} options.source
    * @param {Object}              options.logger
    */
    constructor(options) {

        let { source, logger } = validate(options, [ 'source', 'logger' ]);
        super({ connection: source });
        this._source = source;
        this._logger = logger;
    }

}
