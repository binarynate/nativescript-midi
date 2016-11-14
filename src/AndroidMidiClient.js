import MidiDevice from './MidiDevice';

export default class MidiClient {

    /**
    * @returns {Array.<MidiDevice>}
    */
    getAvailableDevices() {

        return Promise.resolve([
            new MidiDevice({ name: 'Device 1', description: 'First one' }),
            new MidiDevice({ name: 'Device 2', description: 'Second one' })
        ]);
    }
}
