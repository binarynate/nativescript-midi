'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _parameterValidator = require('parameter-validator');

var _parameterValidator2 = _interopRequireDefault(_parameterValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* @property {string}  name
* @property {boolean} isSource
* @property {boolean} isDestination
*/
var MidiDevice = function () {

    /**
    * @param {Object} options
    * @param {string} options.name
    */
    function MidiDevice() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, MidiDevice);

        this.parameterValidator = new _parameterValidator2.default();
        Object.assign(this, _lodash2.default.pick(options, ['name', 'isSource', 'isDestination']));
    }

    /**
    * Connects to the MIDI device in order to be able to receive messages from it.
    *
    * @param   {Object}   options
    * @param   {Function} options.messageHandler - Function that handles an incoming MIDI message
    * @returns {Promise}
    */


    _createClass(MidiDevice, [{
        key: 'connect',
        value: function connect(options) {

            return this.parameterValidator.validateAsync(options, ['messageHandler']);
        }
    }]);

    return MidiDevice;
}();

exports.default = MidiDevice;