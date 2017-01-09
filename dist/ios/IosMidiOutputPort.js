'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _parameterValidator = require('parameter-validator');

var _MidiMessageDelegate = require('./MidiMessageDelegate');

var _MidiMessageDelegate2 = _interopRequireDefault(_MidiMessageDelegate);

var _MidiOutputPort2 = require('../MidiOutputPort');

var _MidiOutputPort3 = _interopRequireDefault(_MidiOutputPort2);

var _IosMidiPortMixin = require('./IosMidiPortMixin');

var _IosMidiPortMixin2 = _interopRequireDefault(_IosMidiPortMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IosMidiOutputPort = function (_MidiOutputPort) {
    _inherits(IosMidiOutputPort, _MidiOutputPort);

    /**
    * @param {Object}              options
    * @param {PGMidi/PGMidiSource} options.source
    * @param {Object}              options.logger
    */
    function IosMidiOutputPort(options) {
        _classCallCheck(this, IosMidiOutputPort);

        var _this = _possibleConstructorReturn(this, (IosMidiOutputPort.__proto__ || Object.getPrototypeOf(IosMidiOutputPort)).call(this));

        var _validate = (0, _parameterValidator.validate)(options, ['source', 'logger']),
            source = _validate.source,
            logger = _validate.logger;

        _this.init({ connection: source, logger: logger });
        _this._source = source;
        _this._midiMessageDelegates = []; // Keeps references to delegates so they're not garbage collected.
        return _this;
    }

    /**
    * Adds a listener that handles MIDI message received from the port.
    *
    * @param {midiMessageListener} messageListener - Callback that handles an incoming MIDI message from the port.
    * @override
    */


    _createClass(IosMidiOutputPort, [{
        key: 'addMessageListener',
        value: function addMessageListener(messageListener) {
            var _this2 = this;

            if (typeof messageListener !== 'function') {
                throw new Error('messageListener must be a function');
            }

            this._log('Adding MIDI message delegate...');

            // Have the delegate call invoke the messageListener, but also pass this output port instance
            // as the second parameter.
            var midiDelegateHandler = function midiDelegateHandler(messages) {
                return messageListener(messages, _this2);
            };

            // Save a reference to the delegate so that it doesn't get garbage collected.
            var delegate = _MidiMessageDelegate2.default.alloc().initWithOptions(this.logger, midiDelegateHandler);
            this._midiMessageDelegates.push(delegate);

            this._source.addDelegate(delegate);
            this._log('MIDI message delegate added successfully.');
        }
    }]);

    return IosMidiOutputPort;
}(_MidiOutputPort3.default);

(0, _IosMidiPortMixin2.default)(IosMidiOutputPort.prototype);
exports.default = IosMidiOutputPort;