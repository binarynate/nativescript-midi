/*globals PGMidi */
import IosMidiDevice from './IosMidiDevice';
import IosMidiOutputPort from './IosMidiOutputPort';
import IosMidiInputPort from './IosMidiInputPort';
import MidiDeviceDelegate from './MidiDeviceDelegate';
import MockLogger from '../MockLogger';

export default class IosMidiDeviceManager {

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

        // It's necessary to reference this delegate directly from this JS class so that it doesn't get
        // garbage collected.
        this._midiDeviceDelegate = MidiDeviceDelegate.alloc().initWithOptions(
            this.logger,
            this._handleSourceAddedEvent.bind(this),
            this._handleSourceRemovedEvent.bind(this),
            this._handleDestinationAddedEvent.bind(this),
            this._handleDestinationRemovedEvent.bind(this)
        );

        this._midiClient.delegate = this._midiDeviceDelegate;
        this._deviceAddedListeners = [];
        this._deviceRemovedListeners = [];
        this._deviceUpdatedListeners = [];
        this._devices = [];
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
    * Gets the available MIDI devices.
    *
    * @returns {Promise.<Array.<IosMidiDevice>>}
    */
    getDevices() {

        return Promise.resolve()
        .then(() => {

            if (this._devices) {
                return this._devices
            }

            return IosMidiDevice.parseDevices({
                logger: this.logger,
                midiClient: this._midiClient
            })
            .then(devices => {
                this._devices = devices;
                return devices;
            });
        });
    }

    /**
    * Adds the given device to the device list and notifies listeners of the addition.
    */
    _addDevice(device) {

        this._devices.push(device);
        this._notifyDeviceAdded(device);
    }

    /**
    * @param {IosMidiPort} port
    */
    _addPort(port) {

        let deviceRef = port.ios.deviceRef;
        let existingDevice = this._devices.find(device => device.ios.deviceRef === deviceRef);

        if (existingDevice) {

            existingDevice.addPort(port);
            return this._notifyDeviceUpdated(existingDevice);
        }

        let newDevice = new IosMidiDevice({
            logger: this.logger,
            name,
            ports: [ port ],
            deviceRef
        });

        this._addDevice(newDevice);
    }

    /**
    * @param {PGMidi/PGMidiSource} source
    */
    _handleSourceAddedEvent(source) {

        this._log(`Handling the "source added" event for the MIDI source '${source.name}'.`);

        let port = new IosMidiOutputPort({ logger: this.logger, source });
        this._addPort(port);
    }

    /**
    * @param {PGMidi/PGMidiSource} source
    */
    _handleSourceRemovedEvent(source) {

        this._log(`Handling the "source removed" event for the MIDI source '${source.name}'.`);

        let port = new IosMidiOutputPort({ logger: this.logger, source });
        this._removePort(port);
    }

    /**
    * @param {PGMidi/PGMidiDestination} destination
    */
    _handleDestinationAddedEvent(destination) {

        this._log(`Handling the "destination added" event for the MIDI destination '${destination.name}'.`);

        let port = new IosMidiInputPort({ logger: this.logger, destination });
        this._addPort(port);
    }

    /**
    * @param {PGMidi/PGMidiDestination} destination
    */
    _handleDestinationRemovedEvent(destination) {

        this._log(`Handling the "destination removed" event for the MIDI destination '${destination.name}'.`);

        let port = new IosMidiInputPort({ logger: this.logger, destination });
        this._removePort(port);
    }

    _log(message, metadata) {
        this.logger.info(`${this.constructor.name}: ${message}`, metadata);
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
    * Removes the given device from the device list and notifies listeners of the removal.
    */
    _removeDevice(device) {

        this._log(`Removing device '${device.name}'.`);
        let index = this._devices.indexOf(device);
        this._devices.splice(index, 1);
        this._notifyDeviceRemoved(device);
    }

    /**
    * @param {IosMidiPort} port
    */
    _removePort(port) {

        let device = this._devices.find(d => d.ios.deviceRef === port.ios.deviceRef);

        if (!device) {
            this._warn(`Not removing MIDI port, because it matches no existing device.`, { port });
            return;
        }

        device.removePort(port);

        if (device.inputPorts.length || device.outputPorts.length) {
            // This device still has ports left, so just notify that it was updated, but don't remove it.
            return this._notifyDeviceUpdated(device);
        }

        // The device has no ports left, so remove it.
        this._removeDevice(device);
    }

    _validateEventListener(callback) {

        if (typeof callback !== 'function') {
            throw new Error('The event listener must be a function.');
        }
    }

    _warn(message, metadata) {
        this.logger.warn(`${this.constructor.name}: ${message}`, metadata);
    }
}
