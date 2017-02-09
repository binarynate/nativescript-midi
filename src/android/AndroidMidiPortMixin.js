import { validate } from 'parameter-validator';
import FunctionalMixin from '../utils/FunctionalMixin';

const AndroidMidiPortMixin = FunctionalMixin({

    /**
    * @param {Object} options
    * @param {android.media.midi.MidiDeviceInfo.PortInfo} options.portInfo
    */
    init(options) {

        validate(options, [ 'logger', 'portInfo' ], this, { addPrefix: '_' });
    },

    /**
    * @protected
    */
    _log(message, metadata) {
        this._logger.info(`${this.constructor.name}: ${message}`, metadata);
    },

    /**
    * @protected
    */
    _warn(message, metadata) {
        this._logger.warn(`${this.constructor.name}: ${message}`, metadata);
    }
});

export default AndroidMidiPortMixin;
