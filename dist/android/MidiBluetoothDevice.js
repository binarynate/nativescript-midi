'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _parameterValidator = require('parameter-validator');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* @property {string}  name
* @property {string}  address
* @property {boolean} isConnected
* @property {android.bluetooth.BluetoothDevice} nativeDevice
* @private
*/
var MidiBluetoothDevice = function MidiBluetoothDevice(options) {
    _classCallCheck(this, MidiBluetoothDevice);

    (0, _parameterValidator.validate)(options, ['nativeDevice'], this);
    this.name = this.nativeDevice.getName();
    this.address = this.nativeDevice.getAddress();
    this.isConnected = false;
};

exports.default = MidiBluetoothDevice;