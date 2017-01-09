/* globals PGMidi */
import MidiDeviceManager from '../MidiDeviceManager';
import IosMidiDevice from './IosMidiDevice';
import IosMidiOutputPort from './IosMidiOutputPort';
import IosMidiInputPort from './IosMidiInputPort';
import MidiDeviceDelegate from './MidiDeviceDelegate';

export default class IosMidiDeviceManager extends MidiDeviceManager {

    /**
    * @param {Object} [options]
    * @param {Object} [options.logger] - optional logger that implements the Winston logging
    *                                    interface.
    * @override
    */
    constructor(options = {}) {

        super(options);
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
    }

    /**
    * Gets the available MIDI devices.
    *
    * @returns {Promise.<Array.<IosMidiDevice>>}
    * @override
    */
    getDevices() {

        return Promise.resolve()
        .then(() => {

            if (this._devices) {
                return this._devices;
            }

            this._devices = IosMidiDevice.parseDevices({
                logger: this.logger,
                midiClient: this._midiClient
            });

            return this._devices;
        });
    }

    /**
    * @param {IosMidiPort} port
    * @private
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
            name: port.ios.endpointName,
            ports: [ port ],
            deviceRef
        });

        this._addDevice(newDevice);
    }

    /**
    * @param {PGMidi/PGMidiSource} source
    * @private
    */
    _handleSourceAddedEvent(source) {

        this._log(`Handling the "source added" event for the MIDI source '${source.name}'.`);

        let port = new IosMidiOutputPort({ logger: this.logger, source });
        this._addPort(port);
    }

    /**
    * @param {PGMidi/PGMidiSource} source
    * @private
    */
    _handleSourceRemovedEvent(source) {

        this._log(`Handling the "source removed" event for the MIDI source '${source.name}'.`);

        let port = new IosMidiOutputPort({ logger: this.logger, source });
        this._removePort(port);
    }

    /**
    * @param {PGMidi/PGMidiDestination} destination
    * @private
    */
    _handleDestinationAddedEvent(destination) {

        this._log(`Handling the "destination added" event for the MIDI destination '${destination.name}'.`);

        let port = new IosMidiInputPort({ logger: this.logger, destination });
        this._addPort(port);
    }

    /**
    * @param {PGMidi/PGMidiDestination} destination
    * @private
    */
    _handleDestinationRemovedEvent(destination) {

        this._log(`Handling the "destination removed" event for the MIDI destination '${destination.name}'.`);

        let port = new IosMidiInputPort({ logger: this.logger, destination });
        this._removePort(port);
    }

    /**
    * @param {IosMidiPort} port
    * @private
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
}
