'use strict';

function Unauthorized(error, errorCode) {
    Error.captureStackTrace(this, this.constructor);
    this.name = 'Unauthorized';
    this.message = error.message || 'Unauthorized';
    this.statusCode = 401;
    this.errorCode = errorCode || 401;
    this.errors = error.errors || ['Missing errors information!'];
    this.debugError = error.debugError;
    return this;
}

Unauthorized.prototype = Error.prototype;
Unauthorized.constructor = Unauthorized;

module.exports = Unauthorized;