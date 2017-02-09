import MidiOutputPort from '../MidiOutputPort';
import AndroidMidiPortMixin from './AndroidMidiPortMixin';

class AndroidMidiOutputPort extends MidiOutputPort {

    constructor() {

        super(...arguments);
        this.init(...arguments);
    }

    addMessageListener() {

        this._log('Pretending to add a message listener...');
    }

}

AndroidMidiPortMixin(AndroidMidiOutputPort.prototype);
export default AndroidMidiOutputPort;
