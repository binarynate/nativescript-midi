
class ExtendableError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor.name);
        }
    }
}

export class MidiError extends ExtendableError {}

/**
* Error that indicates that an abstract or unimplemented method has been invoked.
*/
export class NotImplementedError extends ExtendableError {}
