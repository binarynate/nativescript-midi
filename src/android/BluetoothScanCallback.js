/* global android */
const { ScanCallback } = android.bluetooth.le;
import { validate } from 'parameter-validator';

/**
* Enum to convert Java enums to readable strings for error messages.
* @enum {string}
* @private
*/
export const BLE_SCAN_ERROR = {
    [ ScanCallback.SCAN_FAILED_ALREADY_STARTED ]: 'SCAN_FAILED_ALREADY_STARTED',
    [ ScanCallback.SCAN_FAILED_APPLICATION_REGISTRATION_FAILED ]: 'SCAN_FAILED_APPLICATION_REGISTRATION_FAILED',
    [ ScanCallback.SCAN_FAILED_FEATURE_UNSUPPORTED ]: 'SCAN_FAILED_FEATURE_UNSUPPORTED',
    [ ScanCallback.SCAN_FAILED_INTERNAL_ERROR ]: 'SCAN_FAILED_INTERNAL_ERROR'
};

const BluetoothScanCallback = ScanCallback.extend({

    init() {},

    setCallbacks(options) {

        validate(options, [ 'onScanResult', 'onScanFailed' ], this, { addPrefix: '_' });
    },

    /**
    * @param {int} errorCode
    */
    onScanFailed() {

        return this._onScanFailed(...arguments);
    },

    /**
    * @param {int}        callbackType
    * @param {ScanResult} result
    */
    onScanResult() {

        return this._onScanResult(...arguments);
    }
});

export default BluetoothScanCallback;
