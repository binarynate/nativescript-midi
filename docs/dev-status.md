
# Development Status

## iOS Development

- Essentially complete in preparation for 1.0

## Android Development

- [develop-android branch](https://github.com/BinaryNate/nativescript-midi/tree/develop-android)

### Progress made

- Implemented AndroidMidiDeviceManager
    * getDevices() returns MidiDevice instances for the devices already connected
    * An app can listen for devices added to or removed from the system
    * Has private methods for discovering and connecting to Bluetooth LE MIDI devices

- Partially developed a reusable UI component for managing Bluetooth LE MIDI devices
    * iOS already has a built-in view controller for managing Bluetooth MIDI devices (CABTMIDICentralViewController), so this UI component is intended to be an exact replica of this UI for Android
    * Added a `showBluetoothDevicePage()` method to the `MidiDeviceManager` interface for navigating to this component
    * Displays devices and allows the user to connect, but doesn't provide an option for disconnecting

### TODO

- Implement the methods of the Android input and output port classes (i.e. the actual sending and receiving of MIDI messages)
    * I'm not sure yet whether Android will provide packets of MIDI message data like iOS or will group them into individual messages. I'm hoping for the latter, but if not, I can use my MIDI library to group the packets into messages

- Finish the UI component for managing Bluetooth MIDI devices
    * I have some screenshots of the iOS version to go off of
    * Also need to check if bluetooth is turned on and, if not, prompt the user to turn it on

- Implement a `MidiDeviceManager.checkIfBluetoothIsSupported()` that applications can use to determine whether they should present the option for Bluetooth LE device management page

## Other changes planned prior to the 1.0 release

- Make `MidiDeviceManager` the module's default export and rename it to `MidiManager`
