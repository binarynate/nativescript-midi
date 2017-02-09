'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MidiOutputPort2 = require('../MidiOutputPort');

var _MidiOutputPort3 = _interopRequireDefault(_MidiOutputPort2);

var _AndroidMidiPortMixin = require('./AndroidMidiPortMixin');

var _AndroidMidiPortMixin2 = _interopRequireDefault(_AndroidMidiPortMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AndroidMidiOutputPort = function (_MidiOutputPort) {
    _inherits(AndroidMidiOutputPort, _MidiOutputPort);

    function AndroidMidiOutputPort() {
        _classCallCheck(this, AndroidMidiOutputPort);

        var _this = _possibleConstructorReturn(this, (AndroidMidiOutputPort.__proto__ || Object.getPrototypeOf(AndroidMidiOutputPort)).apply(this, arguments));

        _this.init.apply(_this, arguments);
        return _this;
    }

    _createClass(AndroidMidiOutputPort, [{
        key: 'addMessageListener',
        value: function addMessageListener() {

            this._log('Pretending to add a message listener...');
        }
    }]);

    return AndroidMidiOutputPort;
}(_MidiOutputPort3.default);

(0, _AndroidMidiPortMixin2.default)(AndroidMidiOutputPort.prototype);
exports.default = AndroidMidiOutputPort;