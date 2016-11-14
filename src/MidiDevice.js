import _ from 'lodash';

export default class MidiDevice {

    /**
    * @param {Object} options
    * @param {string} options.name
    */
    constructor(options = {}) {

        Object.assign(this, _.pick(options, [
            'name',
            'description'
        ]));
    }
}
