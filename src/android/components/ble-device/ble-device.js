import Component from 'nativescript-component';
import { validate } from 'parameter-validator';

class BleDeviceComponent extends Component {

    onLoaded() {

        super.onLoaded(...arguments);
        let dependencies = this.get('dependencies');
        validate(dependencies, [ 'midiDeviceManager', 'logger' ], this, { addPrefix: '_' });
        this._updateStatus();
    }

    onTap() {

        this.set('status', 'Connecting...');
        return this._connect()
        .catch(error => {
            this._error('An error occurred while trying to connect to a MIDI bluetooth device.', { error });
        })
        .then(() => {
            this._updateStatus();
        });

    }

    _connect() {
        let bluetoothDevice = this.bindingContext;
        return this._midiDeviceManager.connectToBluetoothDevice({ bluetoothDevice })
        .then(() => {
            this.set('isConnected', true);
        });
    }

    _error(message, metadata) {
        this.logger.error(`${this.constructor.name}: ${message}`, metadata);
    }

    _log(message, metadata) {
        this.logger.info(`${this.constructor.name}: ${message}`, metadata);
    }

    _updateStatus() {
        let status = this.get('isConnected') ? 'Connected' : 'Not Connected';
        this.set('status', status);
    }
}

BleDeviceComponent.export(exports);
