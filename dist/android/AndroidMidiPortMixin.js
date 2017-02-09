'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _parameterValidator = require('parameter-validator');

var _FunctionalMixin = require('../utils/FunctionalMixin');

var _FunctionalMixin2 = _interopRequireDefault(_FunctionalMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AndroidMidiPortMixin = (0, _FunctionalMixin2.default)({

    /**
    * @param {Object} options
    * @param {android.media.midi.MidiDeviceInfo.PortInfo} options.portInfo
    */
    init: function init(options) {

        (0, _parameterValidator.validate)(options, ['logger', 'portInfo'], this, { addPrefix: '_' });
    },


    /**
    * @protected
    */
    _log: function _log(message, metadata) {
        this._logger.info(this.constructor.name + ': ' + message, metadata);
    },


    /**
    * @protected
    */
    _warn: function _warn(message, metadata) {
        this._logger.warn(this.constructor.name + ': ' + message, metadata);
    }
});

exports.default = AndroidMidiPortMixin;