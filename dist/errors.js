"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ExtendableError = exports.ExtendableError = function (_Error) {
    _inherits(ExtendableError, _Error);

    function ExtendableError(message) {
        _classCallCheck(this, ExtendableError);

        var _this = _possibleConstructorReturn(this, (ExtendableError.__proto__ || Object.getPrototypeOf(ExtendableError)).call(this, message));

        _this.name = _this.constructor.name;
        _this.message = message;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(_this, _this.constructor.name);
        }
        return _this;
    }

    return ExtendableError;
}(Error);

var MidiError = exports.MidiError = function (_ExtendableError) {
    _inherits(MidiError, _ExtendableError);

    function MidiError() {
        _classCallCheck(this, MidiError);

        return _possibleConstructorReturn(this, (MidiError.__proto__ || Object.getPrototypeOf(MidiError)).apply(this, arguments));
    }

    return MidiError;
}(ExtendableError);

/**
* Error that indicates that an abstract or unimplemented method has been invoked.
*/


var NotImplementedError = exports.NotImplementedError = function (_ExtendableError2) {
    _inherits(NotImplementedError, _ExtendableError2);

    function NotImplementedError() {
        _classCallCheck(this, NotImplementedError);

        return _possibleConstructorReturn(this, (NotImplementedError.__proto__ || Object.getPrototypeOf(NotImplementedError)).apply(this, arguments));
    }

    return NotImplementedError;
}(ExtendableError);