'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BLE_SCAN_ERROR = undefined;

var _BLE_SCAN_ERROR;

var _parameterValidator = require('parameter-validator');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* global android */
var ScanCallback = android.bluetooth.le.ScanCallback;


/**
* Enum to convert Java enums to readable strings for error messages.
* @enum {string}
* @private
*/
var BLE_SCAN_ERROR = exports.BLE_SCAN_ERROR = (_BLE_SCAN_ERROR = {}, _defineProperty(_BLE_SCAN_ERROR, ScanCallback.SCAN_FAILED_ALREADY_STARTED, 'SCAN_FAILED_ALREADY_STARTED'), _defineProperty(_BLE_SCAN_ERROR, ScanCallback.SCAN_FAILED_APPLICATION_REGISTRATION_FAILED, 'SCAN_FAILED_APPLICATION_REGISTRATION_FAILED'), _defineProperty(_BLE_SCAN_ERROR, ScanCallback.SCAN_FAILED_FEATURE_UNSUPPORTED, 'SCAN_FAILED_FEATURE_UNSUPPORTED'), _defineProperty(_BLE_SCAN_ERROR, ScanCallback.SCAN_FAILED_INTERNAL_ERROR, 'SCAN_FAILED_INTERNAL_ERROR'), _BLE_SCAN_ERROR);

var BluetoothScanCallback = ScanCallback.extend({
    init: function init() {},
    setCallbacks: function setCallbacks(options) {

        (0, _parameterValidator.validate)(options, ['onScanResult', 'onScanFailed'], this, { addPrefix: '_' });
    },


    /**
    * @param {int} errorCode
    */
    onScanFailed: function onScanFailed() {

        return this._onScanFailed.apply(this, arguments);
    },


    /**
    * @param {int}        callbackType
    * @param {ScanResult} result
    */
    onScanResult: function onScanResult() {

        return this._onScanResult.apply(this, arguments);
    }
});

exports.default = BluetoothScanCallback;