import { validate, validateAsync } from 'parameter-validator';
import MidiDevice from '../MidiDevice';
import { MidiError } from '../errors';
import MockLogger from '../MockLogger';
import MidiMessageDelegate from './MidiMessageDelegate';
import IosMidiInputPort from './IosMidiInputPort';
import IosMidiOutputPort from './IosMidiOutputPort';
import IosMidiPort from './IosMidiPort';

/**
* @property {Object}                 ios           - Object exposing iOS-specific properties
* @property {CoreMidi/MIDIDeviceRef} ios.deviceRef
*/
export default class IosMidiDevice extends MidiDevice {

    /**
    * @param {Object}              options
    * @param {string}              options.name
    * @param {Array.<IosMidiPort>} options.ports
    * @param {MIDIDeviceRef}       options.deviceRef
    * @param {Object}              [options.logger] - Optional logger that implements the Winston logging interface.
    */
    constructor(options) {

        super(options);
        let { name, inputPorts, outputPorts, deviceRef } = validate(options, [ 'name', 'ports', 'deviceRef' ]);
        this.logger = options.logger || new MockLogger();
        this.ios = { deviceRef };
        this._ports = ports;
    }

    /**
    * @type {Array.<IosMidiInputPort>}
    */
    get inputPorts() {
        return this._ports.filter(p => p instanceof IosMidiInputPort);
    }

    /**
    * @type {Array.<IosMidiOutputPort>}
    */
    get outputPorts() {
        return this._ports.filter(p => p instanceof IosMidiOutputPort);
    }

    /**
    * Connects to the MIDI device in order to be able to receive messages from it.
    *
    * @param   {Object}   options
    * @param   {Function} options.messageHandler - Function that handles an incoming MIDI message
    * @returns {Promise}
    */
    connect(options) {

        return validateAsync(options, [ 'messageHandler' ])
        .then(({ messageHandler }) => {

            if (this._source) {

                this.logger.info(`Adding MIDI message delegate for device '${this.name}'...`);

                // Save a reference to the delegate so that it doesn't get garbage collected.
                this._midiMessageDelegate = MidiMessageDelegate.alloc().initWithOptions(this.logger, messageHandler);
                this._source.addDelegate(this._midiMessageDelegate);
                this.logger.info('MIDI message delegate added successfully.');
            }
        });
    }

    /**
    * @param {Object}            options
    * @param {interop.Reference} options.bytes  - NativeScript reference to the buffer containing the message
    * @param {number}            options.length - Number of bytes
    */
    send(options) {

        return validateAsync(options, [ 'bytes', 'length' ])
        .then(({ bytes, length }) => {

            if (!this._destination) {
                throw new MidiError(`Can't send a message to the MIDI device '${this.name}', because it's not a destination.`);
            }

            this._log(`Sending MIDI message bytes...`);
            this._destination.sendBytesSize(bytes, length);
            this._log(`Finished sending MIDI message bytes.`);
        });
    }

    /*
    * Methods not part of the MidiDevice interface.
    */

    /**
    * @private
    * @param {IosMidiPort} port
    */
    addPort(port) {

        if (!(port instanceof IosMidiPort)) {
            this._warn('Not adding invalid MIDI input port.', { port });
            return;
        }
        let existingPort = this._ports.find(p => p.isSame(existingPort));

        if (existingPort) {
            this._log('Not adding MIDI port that has already been added.', { port });
            return;
        }
        this._log('Adding MIDI port.', { port });
        this._ports.push(port);
    }

    /**
    * @private
    * @param {IosMidiPort} port
    */
    removePort(port) {

        try {
            let index = this._ports.findIndex(p => p.sameAs(port));

            if (index === -1) {
                this._warn('Not removing unrecognized MIDI port.', { port });
                return;
            }
            this._log('Removing MIDI port.', { port });
            this._ports.splice(index, 1);
        } catch (error) {
            this._warn('Not removing invalid MIDI port.', { port, error });
        }
    }

    /**
    * @private Creates MidiDevice instances from the given PGMidi iOS MIDI client.
    *
    * @param {Object}                   options
    * @param {PGMidi/PGMidi}            options.midiClient
    * @param {Object}                   options.logger
    * @returns {Array.<IosMidiDevice>}
    */
    static parseDevices(options) {

        let { midiClient, logger } = validate(options, [ 'midiClient', 'logger' ]);

        let allOutputPorts = Array.from(midiClient.sources).map(source => new IosMidiOutputPort({ source, logger })),
            allInputPorts = Array.from(midiClient.destinations).map(destination => new IosMidiInputPort({ destination, logger })),
            allPorts = [ ...allOutputPorts, ...allInputPorts ];

        let deviceRefs = allPorts.map(port => port.ios.deviceRef),
            uniqueDeviceRefs = Array.from(new Set(deviceRefs));

        let devices = uniqueDeviceRefs.map(deviceRef => {

            let ports = allPorts.filter(p => p.ios.deviceRef === deviceRef);
            let name = ports[0].ios.endpointName;

            return new IosMidiDevice({ logger, name, ports, deviceRef });
        });
        return devices;
    }

    _log(message, metadata) {
        this.logger.info(`${this.constructor.name}::${this.name}: ${message}`, metadata);
    }

    _warn(message, metadata) {
        this.logger.warn(`${this.constructor.name}::${this.name}: ${message}`, metadata);
    }
}
