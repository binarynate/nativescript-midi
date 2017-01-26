'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MidiDeviceManager = undefined;

var _AndroidMidiDeviceManager = require('./android/AndroidMidiDeviceManager');

var _AndroidMidiDeviceManager2 = _interopRequireDefault(_AndroidMidiDeviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MidiDeviceManager = exports.MidiDeviceManager = _AndroidMidiDeviceManager2.default;