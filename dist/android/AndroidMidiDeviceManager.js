'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global android */

var _application = require('application');

var _application2 = _interopRequireDefault(_application);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* Responsible for fetching available MIDI devices and notifying the application of device changes
* on the Android platform.
*/
var AndroidMidiDeviceManager = function () {
    function AndroidMidiDeviceManager() {
        _classCallCheck(this, AndroidMidiDeviceManager);
    }

    _createClass(AndroidMidiDeviceManager, [{
        key: 'addDeviceAddedListener',
        value: function addDeviceAddedListener() {}
    }, {
        key: 'addDeviceRemovedListener',
        value: function addDeviceRemovedListener() {}
    }, {
        key: 'addDeviceUpdatedListener',
        value: function addDeviceUpdatedListener() {}
    }, {
        key: 'getDevices',
        value: function getDevices() {
            var MIDI_SERVICE = android.content.Context.MIDI_SERVICE;

            var midiManager = _application2.default.android.currentContext.getSystemService(MIDI_SERVICE);

            console.log('typeof midiManager.getDevices: ' + _typeof(midiManager.getDevices));
            return new Promise(function (resolve) {
                return setTimeout(resolve, 2000);
            }).then(function () {
                return [];
            });
        }
    }]);

    return AndroidMidiDeviceManager;
}();

exports.default = AndroidMidiDeviceManager;