import { validate } from 'parameter-validator';

/**
* @property {string}  name
* @property {string}  address
* @property {boolean} isConnected
* @property {android.bluetooth.BluetoothDevice} nativeDevice
* @private
*/
class MidiBluetoothDevice {

    constructor(options) {

        validate(options, [ 'nativeDevice' ], this);
        this.name = this.nativeDevice.getName();
        this.address = this.nativeDevice.getAddress();
        this.isConnected = false;
    }
}

export default MidiBluetoothDevice;
