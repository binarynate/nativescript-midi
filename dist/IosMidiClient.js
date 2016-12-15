'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*globals PGMidi */


var _MidiDevice = require('./MidiDevice');

var _MidiDevice2 = _interopRequireDefault(_MidiDevice);

var _MockLogger = require('./MockLogger');

var _MockLogger2 = _interopRequireDefault(_MockLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MidiClient = function () {

    /**
    * @param {Object} [options]
    * @param {Object} [options.logger] - optional logger that implements the Winston logging
    *                                    interface.
    */
    function MidiClient() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, MidiClient);

        this.logger = options.logger || new _MockLogger2.default();
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

                var midiDevices = Array.from(_this._midiClient.sources).map(function (source) {
                    return { source: source, name: source.name };
                });

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    var _loop = function _loop() {
                        var destination = _step.value;


                        var device = midiDevices.find(function (d) {
                            return d.name === destination.name;
                        });

                        if (device) {
                            device.destination = destination;
                        } else {
                            midiDevices.push({ destination: destination, name: destination.name });
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

                return midiDevices.map(function (deviceInfo) {
                    return new _MidiDevice2.default(Object.assign(deviceInfo, { logger: _this.logger }));
                });
            });
        }
    }]);

    return MidiClient;
}();

exports.default = MidiClient;