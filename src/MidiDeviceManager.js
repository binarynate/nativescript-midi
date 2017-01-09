import MockLogger from './MockLogger';
import { NotImplementedError } from './errors';

/**
* @class Responsible for fetching available MIDI devices and notifying the application of device changes.
*/
export default class MidiDeviceManager {

    /**
    * @param {Object} [options]
    * @param {Object} [options.logger] - optional logger that implements the Winston logging
    *                                    interface.
    */
    constructor(options = {}) {
        this.logger = options.logger || new MockLogger();

        this._deviceAddedListeners = [];
        this._deviceRemovedListeners = [];
        this._deviceUpdatedListeners = [];
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
    * @returns {Promise.<Array.<MidiDevice>>}
    * @abstract
    */
    getDevices() {

        return Promise.reject(new NotImplementedError());
    }

    /**
    * Adds the given device to the device list and notifies listeners of the addition.
    *
    * @param {MidiDevice} device
    * @protected
    */
    _addDevice(device) {

        this._devices.push(device);
        this._notifyDeviceAdded(device);
    }

    _log(message, metadata) {
        this.logger.info(`${this.constructor.name}: ${message}`, metadata);
    }

    /**
    * Notifies listeners that the given MIDI device has been added.
    *
    * @param {MidiDevice} device
    * @protected
    */
    _notifyDeviceAdded(device) {

        for (let callback of this._deviceAddedListeners) {
            try {
                callback(device);
            } catch (error) {
                this.logger.error('A "device added" listener threw an error.', { error });
            }
        }
    }

    /**
    * Notifies listeners that the given MIDI device has been removed.
    *
    * @param {MidiDevice} device
    * @protected
    */
    _notifyDeviceRemoved(device) {

        for (let callback of this._deviceRemovedListeners) {
            try {
                callback(device);
            } catch (error) {
                this.logger.error('A "device removed" listener threw an error.', { error });
            }
        }
    }

    /**
    * Notifies listeners that the given MIDI device has been updated (e.g. removed port, etc).
    *
    * @param {MidiDevice} device
    * @protected
    */
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
    *
    * @param {MidiDevice} device
    * @protected
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

    _warn(message, metadata) {
        this.logger.warn(`${this.constructor.name}: ${message}`, metadata);
    }
}
