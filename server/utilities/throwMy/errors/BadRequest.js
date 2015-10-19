'use strict';

function BadRequest(error, errorCode) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = error.message || 'Bad Request';
    this.statusCode = 400;
    this.errorCode = errorCode || 400;
    this.errors = error.errors || ['Missing errors information!'];
    this.debugError = error.debugError;
    return this;
}

BadRequest.prototype = Error.prototype;
BadRequest.constructor = BadRequest;

module.exports = BadRequest;