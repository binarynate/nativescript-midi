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

        return (new Promise(resolve => setTimeout(resolve, 2000))).then(() => []);
    }
}

export default AndroidMidiDeviceManager;
