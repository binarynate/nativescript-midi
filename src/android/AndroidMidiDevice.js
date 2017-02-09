/* global android */
const { MidiDeviceInfo } = android.media.midi;
const { TYPE_INPUT } = android.media.midi.MidiDeviceInfo.PortInfo;
import { validate } from 'parameter-validator';
import MidiDevice from '../MidiDevice';
import AndroidMidiInputPort from './AndroidMidiInputPort';
import AndroidMidiOutputPort from './AndroidMidiOutputPort';

class AndroidMidiDevice extends MidiDevice {

    /**
    * @param {Object} options
    * @param {android.media.midi.MidiDeviceInfo} options.midiDeviceInfo
    */
    constructor(options) {

        super(...arguments);
        validate(options, [ 'midiDeviceInfo' ], this, { addPrefix: '_' });
        let properties = this._midiDeviceInfo.getProperties();
        this._name = properties.getString(MidiDeviceInfo.PROPERTY_NAME);
        this._initPorts();
    }

    /**
    * @override
    */
    get name() {
        return this._name;
    }

    /**
    * @override
    */
    get inputPorts() {
        return this._ports.filter(port => port instanceof AndroidMidiInputPort);
    }

    /**
    * @override
    */
    get outputPorts() {
        return this._ports.filter(port => port instanceof AndroidMidiOutputPort);
    }

    _initPorts() {

        let portInfos = this._midiDeviceInfo.getPorts(),
            logger = this._logger;

        this._ports = Array.from(portInfos).map(portInfo => {

            return portInfo.getType() === TYPE_INPUT ? new AndroidMidiInputPort({ portInfo, logger })
                                                     : new AndroidMidiOutputPort({ portInfo, logger });
        });
    }
}

export default AndroidMidiDevice;
