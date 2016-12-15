/*globals PGMidi */
import MidiDevice from './IosMidiDevice';
import MockLogger from './MockLogger';

export default class MidiClient {

    /**
    * @param {Object} [options]
    * @param {Object} [options.logger] - optional logger that implements the Winston logging
    *                                    interface.
    */
    constructor(options = {}) {
        this.logger = options.logger || new MockLogger();
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

            let midiDevices = Array.from(this._midiClient.sources).map(source => ({ source, name: source.name }));

            for (let destination of this._midiClient.destinations) {

                let device = midiDevices.find(d => d.name === destination.name);

                if (device) {
                    device.destination = destination;
                } else {
                    midiDevices.push({ destination, name: destination.name });
                }
            }

            return midiDevices.map(deviceInfo => new MidiDevice(Object.assign(deviceInfo, { logger: this.logger })));
        });
    }
}
