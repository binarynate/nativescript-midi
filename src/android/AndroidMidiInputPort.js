import MidiInputPort from '../MidiInputPort';
import AndroidMidiPortMixin from './AndroidMidiPortMixin';

class AndroidMidiInputPort extends MidiInputPort {

    /**
    * @param {Object} options
    * @param {android.media.midi.MidiDeviceInfo.PortInfo} options.portInfo
    */
    constructor(options) {

        super();
        this.init(options);
    }

    send() {
        this._logger(`Pretending to send MIDI bytes...`);
        return Promise.resolve();
    }

}

AndroidMidiPortMixin(AndroidMidiInputPort.prototype);
export default AndroidMidiInputPort;
