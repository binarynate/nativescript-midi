/* global android */

import app from 'application';


/**
* Responsible for fetching available MIDI devices and notifying the application of device changes
* on the Android platform.
*/
class AndroidMidiDeviceManager {

    addDeviceAddedListener() {

    }

    addDeviceRemovedListener() {

    }

    addDeviceUpdatedListener() {

    }

    getDevices() {

        let { MIDI_SERVICE } = android.content.Context;
        let midiManager = app.android.currentContext.getSystemService(MIDI_SERVICE);

        console.log(`typeof midiManager.getDevices: ${typeof midiManager.getDevices}`);
        return (new Promise(resolve => setTimeout(resolve, 2000))).then(() => []);
    }
}

export default AndroidMidiDeviceManager;
