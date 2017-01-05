'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _parameterValidator = require('parameter-validator');

var _IosMidiPort2 = require('./IosMidiPort');

var _IosMidiPort3 = _interopRequireDefault(_IosMidiPort2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IosMidiInputPort = function (_IosMidiPort) {
    _inherits(IosMidiInputPort, _IosMidiPort);

    /**
    * @param {Object}                   options
    * @param {PGMidi/PGMidiDestination} options.destination
    * @param {Object}                   options.logger
    */
    function IosMidiInputPort(options) {
        _classCallCheck(this, IosMidiInputPort);

        var _validate = (0, _parameterValidator.validate)(options, ['destination', 'logger']),
            destination = _validate.destination,
            logger = _validate.logger;

        var _this = _possibleConstructorReturn(this, (IosMidiInputPort.__proto__ || Object.getPrototypeOf(IosMidiInputPort)).call(this, { connection: destination, logger: logger }));

        _this._destination = destination;
        return _this;
    }

    /**
    * Sends the given MIDI bytes to the input port.
    *
    * @param {Object}            options
    * @param {interop.Reference} options.bytes  - NativeScript reference to the buffer containing the message
    * @param {number}            options.length - Number of bytes
    */


    _createClass(IosMidiInputPort, [{
        key: 'send',
        value: function send(options) {
            var _this2 = this;

            return (0, _parameterValidator.validateAsync)(options, ['bytes', 'length']).then(function (_ref) {
                var bytes = _ref.bytes,
                    length = _ref.length;


                _this2._log('Sending MIDI message bytes...');
                _this2._destination.sendBytesSize(bytes, length);
                _this2._log('Finished sending MIDI message bytes.');
            });
        }
    }]);

    return IosMidiInputPort;
}(_IosMidiPort3.default);

exports.default = IosMidiInputPort;