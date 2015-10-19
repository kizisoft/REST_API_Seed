'use strict';

function InternalServerError(error, errorCode) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = error.message || 'Internal Server Error';
    this.statusCode = 500;
    this.errorCode = errorCode || 500;
    this.errors = error.errors || ['Missing errors information!'];
    this.debugError = error.debugError;
    return this;
}

InternalServerError.prototype = Error.prototype;
InternalServerError.constructor = InternalServerError;

module.exports = InternalServerError;