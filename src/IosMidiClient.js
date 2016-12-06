/*globals PGMidi */
import MidiDevice from './MidiDevice';

export default class MidiClient {

    constructor() {
        this._midiClient = new PGMidi();
        this._midiClient.networkEnabled = true;
        this._midiClient.virtualDestinationEnabled = true;
        this._midiClient.virtualSourceEnabled = true;
    }

    /**
    * @returns {Array.<MidiDevice>}
    */
    getAvailableDevices() {

        return Promise.resolve()
        .then(() => {

            let midiDevices = Array.from(this._midiClient.sources).map(({ name }) => ({ name, isSource: true }));

            for (let { name } of this._midiClient.destinations) {

                let device = midiDevices.find(d => d.name === name);

                if (device) {
                    device.isDestination = true;
                } else {
                    midiDevices.push({ name, isDestination: true, isSource: false });
                }
            }

            if (midiDevices.length) {
                return midiDevices.map(m => new MidiDevice(m));
            }

            return [ new MidiDevice({ name: 'No devices found' })];
        });
    }
}
