# nativescript-midi

A NativeScript plugin for communicating with MIDI devices (e.g. musical instruments or apps).

A basic understanding of the [MIDI (*Musical Instrument Digital Interface*) message protocol](http://www.gweep.net/~prefect/eng/reference/protocol/midispec.html) is required to use this plugin.

## Project status

This plugin has been designed to allow a uniform interface to be used for MIDI communication on both iOS and Android, however only the iOS platform has been implemented so far. Once the Android support is implemented and tested, the interface will be considered stable, and the major version will be incremented to 1.0. Until then, breaking changes may still occur while the project is in the 0.x cycle. Contributions are welcome to help with the Android implementation!

## Installation

Assuming you've already [installed the NativeScript CLI](http://docs.nativescript.org/start/quick-setup):

```
tns plugin install nativescript-midi
```

## Programming interfaces

An application interacts with the plugin through interfaces which resemble those in [Android's MIDI API](https://developer.android.com/reference/android/media/midi/package-summary.html):

- `MidiDeviceManager`: Fetches available MIDI devices and notifies the application of device changes.
- `MidiDevice`: A named device with input ports and output ports through which communication occurs.
- `MidiInputPort`: Provides a method by which an application can send MIDI messages to the device.
- `MidiOutputPort`: Notifies the application of messages received from the device.

## Example

```js
import { MidiDeviceManager } from 'nativescript-midi';


let midiDeviceManager = new MidiDeviceManager(),
    midiDevices;

midiDeviceManager.getDevices()
.then(devices => {

    midiDevices = devices; // Save a reference to the devices for later use in the app.

    // Listen for device added / removed / updated events.
    midiDeviceManager.addDeviceAddedListener(deviceAdded => { /* handle added device */ });
    midiDeviceManager.addDeviceRemovedListener(deviceRemoved => { /* handle removed device */ });
    midiDeviceManager.addDeviceUpdatedListener(deviceUpdated => { /* handle updated device (e.g. ports changed) */ });

    // Let's assume for this example that we know there's a device with at least one input port and one output port.
    let device = midiDevices.find(device => device.inputPorts.length && device.outputPorts.length);

    // Here we listen for any messages from the device (i.e. from all outputPorts), but alternatively, you can listen for messages on just a single port with `device.outputPorts[i].addMessageListener()`
    device.addMessageListener((messages, outputPort) => {

        let portIndex = device.outputPorts.indexOf(outputPort);

        // The packets received from a system's MIDI device (i.e. MIDIPacketList on iOS) are automatically parsed into discrete messages for you 👍.
        for (let message of messages) {

            console.log(`Received a MIDI message from outputPort ${portIndex} of device ${device.name}:`);
            console.log(message instanceof Uint8Array); // `true`
            message.forEach((byte, byteIndex) => console.log(`byte ${byteIndex}: ${byte}`));
        }
    });

    console.log(`Sending a message to inputPort 0 of device ${device.name} to play middle-C...`);

    let bytes = new Uint8Array([
        0x90, // "Note On" status byte
        0x3C, // Pitch value for middle-C
        0xFF  // Full volume
    ]);

    // Here we send a message to a single input port on the device. Alternatively, you can send the message to *all* of the device's input ports with `device.send()`.
    return device.inputPort[0].send({ bytes });
})
.then(() => console.log(`Successfully finished sending the MIDI message 🎵`))
.catch(error => console.log(`Yikes - something went wrong. ` + error.stack));
```

## Logging

The plugin's classes log information internally. To capture or display this log info, construct the `MidiDeviceManager` with a `logger` object that implements a [Winston](https://github.com/winstonjs/winston)-style logger.

```js
let logger = {

    info(message, metadata) {
        console.log(`INFO: ${message} ${JSON.stringify(metadata)}`);
    },

    warn(message, metadata) {
        console.log(`WARN: ${message} ${JSON.stringify(metadata)}`);
    },

    error(message, metadata) {
        console.log(`ERROR: ${message} ${JSON.stringify(metadata)}`);
    }
};

let midiDeviceManager = new MidiDeviceManager({ logger });
```

## Contributing

Contributions are welcome, especially on the Android work that's needed for the 1.0 release.

### Building

This module is implemented in ES 6 and transpiled to ES 5 for export. To build the source:

```
npm run build
```

### Linting

```
npm run lint
```

### Project Dependencies

A MIDI packet (i.e. MIDIPacketList on iOS) can contain multiple MIDI messages, and a single MIDI System Exclusive (SysEx) message can span multiple packets. This detail is hidden from the plugin consumer so that the application just receives an array of messages that have already been parsed and validated.

This message parsing logic is implemented in the [midi-message-parser C library](https://github.com/BinaryNate/midi-message-parser), which I am also using within a separate a MIDI hardware product with which this plugin can communicate. The [cocoa-midi-message-parser](https://github.com/BinaryNate/cocoa-midi-message-parser) wrapper is used to expose this C library to the NativeScript runtime and to avoid some of the runtime's limitations surrounding C interop (e.g. lack of support for C structs which contain arrays).

```
nativescript-midi
    |
    |-- cocoa-midi-message-parser
        |
        |-- midi-message-parser
```
