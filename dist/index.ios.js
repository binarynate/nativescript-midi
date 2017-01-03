'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MidiDeviceManager = undefined;

var _IosMidiDeviceManager = require('./ios/IosMidiDeviceManager');

var _IosMidiDeviceManager2 = _interopRequireDefault(_IosMidiDeviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MidiDeviceManager = exports.MidiDeviceManager = _IosMidiDeviceManager2.default;