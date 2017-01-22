'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _parameterValidator = require('parameter-validator');

var MidiLoggerDelegate = NSObject.extend({

    /**
    * @param {Logger}                     logger
    */
    initWithOptions: function initWithOptions(logger) {

        var self = this.super.init();
        (0, _parameterValidator.validate)({ logger: logger }, ['logger'], this);
        return self;
    },
    log: function log(message) {
        this.logger.info(message);
    }
}, {
    protocols: [SDLoggerDelegate],
    exposedMethods: [{
        log: {
            returns: interop.types.void,
            params: [NSString]
        }
    }]
}); /* globals NSObject, NSString, interop, SDLoggerDelegate */
exports.default = MidiLoggerDelegate;