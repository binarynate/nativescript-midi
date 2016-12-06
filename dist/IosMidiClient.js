'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*globals PGMidi */


var _MidiDevice = require('./MidiDevice');

var _MidiDevice2 = _interopRequireDefault(_MidiDevice);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MidiClient = function () {
    function MidiClient() {
        _classCallCheck(this, MidiClient);

        this._midiClient = new PGMidi();
        this._midiClient.networkEnabled = true;
        this._midiClient.virtualDestinationEnabled = true;
        this._midiClient.virtualSourceEnabled = true;
    }

    /**
    * @returns {Array.<MidiDevice>}
    */


    _createClass(MidiClient, [{
        key: 'getAvailableDevices',
        value: function getAvailableDevices() {
            var _this = this;

            return Promise.resolve().then(function () {

                var midiDevices = _this._midiClient.sources.map(function (_ref) {
                    var name = _ref.name;
                    return { name: name, isSource: true };
                });

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    var _loop = function _loop() {
                        var name = _step.value.name;


                        var device = midiDevices.find(function (d) {
                            return d.name === name;
                        });

                        if (device) {
                            device.isDestination = true;
                        } else {
                            midiDevices.push({ name: name, isDestination: true, isSource: false });
                        }
                    };

                    for (var _iterator = _this._midiClient.destinations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        _loop();
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                if (midiDevices.length) {
                    return midiDevices.map(function (m) {
                        return new _MidiDevice2.default(m);
                    });
                }

                return [new _MidiDevice2.default({ name: 'No devices found' })];
            });
        }
    }]);

    return MidiClient;
}();

exports.default = MidiClient;