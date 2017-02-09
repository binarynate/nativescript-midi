import Component from 'nativescript-component';
import { validate } from 'parameter-validator';
import { ObservableArray } from 'data/observable-array';
import { Observable } from 'data/observable';

class BleDevicesPage extends Component {

    /**
    * @override
    */
    onNavigatingTo() {

        super.onNavigatingTo(...arguments);

        let dependencies = this.get('dependencies');
        validate(dependencies, [
            'midiDeviceManager',
            'logger'
        ], this, { addPrefix: '_'});

        return this._loadBluetoothDevices()
        .then(() => {
            this._log(`Attaching bluetooth device listeners.`);
            this._midiDeviceManager.addBluetoothDeviceAddedListener(this._onDeviceAdded.bind(this));
            this._midiDeviceManager.addBluetoothScanFailedListener(this._onScanFailed.bind(this));
        })
        .catch(error => {
            this._logger.error('An error occurred while loading bluetooth devices.', { error });
        });
    }

    _formatDeviceForDisplay(device) {
        let observableDevice = new Observable(device);
        observableDevice.set('status', '');
        return observableDevice;
    }

    _loadBluetoothDevices() {

        this._log('Getting bluetooth devices...');

        this.set('isLoading', true);
        return this._midiDeviceManager.getBluetoothDevices({ timeout: 2000 })
        .then(devices => {
            this._log(`Successfully found ${devices.length} bluetooth devices.`);

            let formattedDevices = devices.map(device => this._formatDeviceForDisplay(device));
            this.set('devices', new ObservableArray(formattedDevices));
        })
        .catch(error => {
            this._logger.error(`An error occurred while getting bluetooth devices.`, { error });
        })
        .then(() => {
            this.set('isLoading', false);
            this._log('Finished getting bluetooth devices.');
        });
    }

    _log(message, metadata) {
        this._logger.info(`${this.constructor.name}: ${message}`, metadata);
    }

    /**
    * @param {BluetoothDevice} device
    */
    _onDeviceAdded(device) {
        this._log(`Adding new bluetooth device named '${device.name}'`);
        let formattedDevice = this._formatDeviceForDisplay(device);
        this.get('devices').push(formattedDevice);
    }

    _onScanFailed(message) {
        /** @todo - Consider showing an error message to the user. */
        this._logger.error(message);
    }
}

BleDevicesPage.export(exports);
