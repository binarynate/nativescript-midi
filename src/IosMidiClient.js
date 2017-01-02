/*globals PGMidi */
import IosMidiDevice from './IosMidiDevice';
import MidiDeviceDelegate from 'ios/MidiDeviceDelegate';
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
        this._midiClient.delegate = MidiDeviceDelegate.alloc().initWithOptions(
            this.logger,
            this._handleSourceAddedEvent.bind(this),
            this._handleSourceRemovedEvent.bind(this),
            this._handleDestinationAddedEvent.bind(this),
            this._handleDestinationRemovedEvent.bind(this)
        );
        this._deviceAddedListeners = [];
        this._deviceRemovedListeners = [];
        this._deviceUpdatedListeners = [];
        this._devices = this._discoverDevices();
    }

    /**
    * The public property for accessing the available MIDI Devices.
    *
    * @property {Array.<MidiDevice>}
    */
    get devices() {
        return this._devices;
    }

    /**
    * A callback that responds to a device change event.
    *
    * @callback deviceEventCallback
    * @param {MidiDevice}
    */

    /**
    * Registers a callback that is invoked when a device is added.
    *
    * @param {deviceEventCallback} callback
    */
    addDeviceAddedListener(callback) {

        this._validateEventListener(callback);

        if (!this._deviceAddedListeners.includes(callback)) {
            this._deviceAddedListeners.push(callback);
        }
    }

    /**
    * Registers a callback that is invoked when a device is removed.
    *
    * @param {deviceEventCallback} callback
    */
    addDeviceRemovedListener(callback) {

        this._validateEventListener(callback);

        if (!this._deviceRemovedListeners.includes(callback)) {
            this._deviceRemovedListeners.push(callback);
        }
    }

    /**
    * Registers a callback that is invoked when a device is updated.
    *
    * An example of an update is that a device that wasn't previously a MIDI source (i.e. was only
    * a destination) becomes a MIDI source.
    *
    * @param {deviceEventCallback} callback
    */
    addDeviceUpdatedListener(callback) {

        this._validateEventListener(callback);

        if (!this._deviceUpdatedListeners.includes(callback)) {
            this._deviceUpdatedListeners.push(callback);
        }
    }

    /**
    * Performs an initial search for available MIDI devices.
    *
    * @returns {Array.<MidiDevice>}
    */
    _discoverDevices() {

        let midiDevices = Array.from(this._midiClient.sources).map(source => ({ source, name: source.name }));

        for (let destination of this._midiClient.destinations) {

            let device = midiDevices.find(d => d.name === destination.name);

            if (device) {
                device.destination = destination;
            } else {
                midiDevices.push({ destination, name: destination.name });
            }
        }

        return midiDevices.map(deviceInfo => new IosMidiDevice(Object.assign(deviceInfo, { logger: this.logger })));
    }

    /**
    * @param {PGMidi/PGMidiSource} source
    */
    _handleSourceAddedEvent(source) {

        this._log(`Handling the "source added" event for the MIDI source '${source.name}'.`);

        let { name } = source,
            existingDevice = this._devices.find(d => d.name === name);

        if (existingDevice) {
            existingDevice.addSource(source);
            return this._notifyDeviceUpdated(existingDevice);
        }

        let newDevice = new IosMidiDevice({
            logger: this.logger,
            name,
            source
        });

        this._addDevice(newDevice);
    }

    /**
    * @param {PGMidi/PGMidiSource} source
    */
    _handleSourceRemovedEvent(source) {

        this._log(`Handling the "source removed" event for the MIDI source '${source.name}'.`);

        let { name } = source,
            device = this._devices.find(d => d.name === name);

        if (!device) {
            this._warn(`Not removing MIDI source, because it matches no existing device.`, { name: source.name });
            return;
        }

        if (device.isDestination) {
            // The device is still a destination, so just remove the source.
            device.removeSource();
            return this._notifyDeviceUpdated(device);
        }

        // The device is not a destination, either, so just remove it.
        this._removeDevice(device);
    }

    /**
    * @param {PGMidi/PGMidiDestination} destination
    */
    _handleDestinationAddedEvent(destination) {

        this._log(`Handling the "destination added" event for the MIDI destination '${destination.name}'.`);

        let { name } = destination,
            existingDevice = this._devices.find(d => d.name === name);

        if (existingDevice) {
            existingDevice.addDestination(destination);
            return this._notifyDeviceUpdated(existingDevice);
        }

        let newDevice = new IosMidiDevice({
            logger: this.logger,
            name,
            destination
        });

        this._addDevice(newDevice);
    }

    /**
    * @param {PGMidi/PGMidiDestination} destination
    */
    _handleDestinationRemovedEvent(destination) {

        this._log(`Handling the "destination removed" event for the MIDI destination '${destination.name}'.`);

        let { name } = destination,
            device = this._devices.find(d => d.name === name);

        if (!device) {
            this._warn(`Not removing MIDI destination, because it matches no existing device.`, { name: destination.name });
            return;
        }

        if (device.isSource) {
            // The device is still a source, so just remove the destination.
            device.removeDestination();
            return this._notifyDeviceUpdated(device);
        }

        // The device is not a destination, either, so just remove it.
        this._removeDevice(device);
    }

    _log(message, metadata) {
        this.logger.info(`${this.constructor.name}: ${message}`, metadata);
    }

    _warn(message, metadata) {
        this.logger.warn(`${this.constructor.name}: ${message}`, metadata);
    }

    _notifyDeviceAdded(device) {

        for (let callback of this._deviceAddedListeners) {
            try {
                callback(device);
            } catch (error) {
                this.logger.error('A "device added" listener threw an error.', { error });
            }
        }
    }

    _notifyDeviceRemoved(device) {

        for (let callback of this._deviceRemovedListeners) {
            try {
                callback(device);
            } catch (error) {
                this.logger.error('A "device removed" listener threw an error.', { error });
            }
        }
    }

    _notifyDeviceUpdated(device) {

        for (let callback of this._deviceUpdatedListeners) {
            try {
                callback(device);
            } catch (error) {
                this.logger.error('A "device updated" listener threw an error.', { error });
            }
        }
    }

    /**
    * Adds the given device to the device list and notifies listeners of the addition.
    */
    _addDevice(device) {

        this._devices.push(device);
        this._notifyDeviceAdded(device);
    }

    /**
    * Removes the given device from the device list and notifies listeners of the removal.
    */
    _removeDevice(device) {

        this._log(`Removing device '${device.name}'.`);
        let index = this._devices.indexOf(device);
        this._devices.splice(index, 1);
        this._notifyDeviceRemoved(device);
    }

    _validateEventListener(callback) {

        if (typeof callback !== 'function') {
            throw new Error('The event listener must be a function.');
        }
    }
}
