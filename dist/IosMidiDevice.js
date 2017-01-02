'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _parameterValidator = require('parameter-validator');

var _parameterValidator2 = _interopRequireDefault(_parameterValidator);

var _MidiDevice2 = require('./MidiDevice');

var _MidiDevice3 = _interopRequireDefault(_MidiDevice2);

var _errors = require('./errors');

var _MockLogger = require('./MockLogger');

var _MockLogger2 = _interopRequireDefault(_MockLogger);

var _MidiMessageDelegate = require('./ios/MidiMessageDelegate');

var _MidiMessageDelegate2 = _interopRequireDefault(_MidiMessageDelegate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IosMidiDevice = function (_MidiDevice) {
    _inherits(IosMidiDevice, _MidiDevice);

    /**
    * @param {Object}            options
    * @param {string}            options.name
    * @param {PGMidiSource}      [options.source]      - Include if this device is a MIDI source
    * @param {PGMidiDestination} [options.destination] - Include if this device is a MIDI destination
    * @param {Object}            [options.logger]      - Optional logger that implements the Winston logging interface.
    */
    function IosMidiDevice(options) {
        _classCallCheck(this, IosMidiDevice);

        var _this = _possibleConstructorReturn(this, (IosMidiDevice.__proto__ || Object.getPrototypeOf(IosMidiDevice)).call(this, options));

        _this.parameterValidator = new _parameterValidator2.default();
        _this.parameterValidator.validate(options, ['name', ['source', 'destination']]);
        _this.name = options.name;
        _this._source = options.source;
        _this._destination = options.destination;
        _this.logger = options.logger || new _MockLogger2.default();
        return _this;
    }

    _createClass(IosMidiDevice, [{
        key: 'connect',


        /**
        * Connects to the MIDI device in order to be able to receive messages from it.
        *
        * @param   {Object}   options
        * @param   {Function} options.messageHandler - Function that handles an incoming MIDI message
        * @returns {Promise}
        */
        value: function connect(options) {
            var _this2 = this;

            return this.parameterValidator.validateAsync(options, ['messageHandler']).then(function (_ref) {
                var messageHandler = _ref.messageHandler;


                if (_this2._source) {

                    _this2.logger.info('Adding MIDI message delegate for device \'' + _this2.name + '\'...');

                    // Save a reference to the delegate so that it doesn't get garbage collected.
                    _this2._midiMessageDelegate = _MidiMessageDelegate2.default.alloc().initWithOptions(_this2.logger, messageHandler);
                    _this2._source.addDelegate(_this2._midiMessageDelegate);
                    _this2.logger.info('MIDI message delegate added successfully.');
                }
            });
        }

        /**
        * @param {Object}            options
        * @param {interop.Reference} options.bytes  - NativeScript reference to the buffer containing the message
        * @param {number}            options.length - Number of bytes
        */

    }, {
        key: 'send',
        value: function send(options) {
            var _this3 = this;

            return this.parameterValidator.validateAsync(options, ['bytes', 'length']).then(function (_ref2) {
                var bytes = _ref2.bytes,
                    length = _ref2.length;


                if (!_this3._destination) {
                    throw new _errors.MidiError('Can\'t send a message to the MIDI device \'' + _this3.name + '\', because it\'s not a destination.');
                }

                _this3._log('Sending MIDI message bytes...');
                _this3._destination.sendBytesSize(bytes, length);
                _this3._log('Finished sending MIDI message bytes.');
            });
        }

        /*
        * Methods not part of the MidiDevice interface.
        */

        /**
        * Adds a PGMidiSource for the device.
        *
        * @param {PGMidi/PGMidiSource} source
        */

    }, {
        key: 'addSource',
        value: function addSource(source) {

            this._log('Adding MIDI source.');
            this._source = source;
        }

        /**
        * Removes the device's PGMidiSource.
        */

    }, {
        key: 'removeSource',
        value: function removeSource() {

            this._log('Removing MIDI source.');
            delete this._source;
        }

        /**
        * Adds a PGMidiDestination for the device.
        *
        * @param {PGMidi/PGMidiDestination} destination
        */

    }, {
        key: 'addDestination',
        value: function addDestination(destination) {

            this._log('Adding MIDI destination.');
            this._destination = destination;
        }

        /**
        * Removes the device's PGMidiDestination.
        */

    }, {
        key: 'removeDestination',
        value: function removeDestination() {

            this._log('Removing MIDI destination.');
            delete this._destination;
        }
    }, {
        key: '_log',
        value: function _log(message, metadata) {
            this.logger.info(this.constructor.name + '::' + this.name + ': ' + message, metadata);
        }
    }, {
        key: 'isSource',
        get: function get() {
            return !!this._source;
        }
    }, {
        key: 'isDestination',
        get: function get() {
            return !!this._destination;
        }
    }]);

    return IosMidiDevice;
}(_MidiDevice3.default);

exports.default = IosMidiDevice;