/* globals NSObject, NSString, interop, SDLoggerDelegate */
import { validate } from 'parameter-validator';

const MidiLoggerDelegate = NSObject.extend({

    /**
    * @param {Logger}                     logger
    */
    initWithOptions(logger) {

        let self = this.super.init();
        validate({ logger }, [ 'logger' ], this);
        return self;
    },

    log(message) {
        this.logger.info(message);
    }
}, {
    protocols: [ SDLoggerDelegate ],
    exposedMethods: [
        {
            log: {
                returns: interop.types.void,
                params: [ NSString ]
            }
        }
    ]
});

export default MidiLoggerDelegate;
