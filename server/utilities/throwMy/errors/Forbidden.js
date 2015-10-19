'use strict';

function Forbidden(error, errorCode) {
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.message = error.message || 'Forbidden';
    this.statusCode = 403;
    this.errorCode = errorCode || 403;
    this.errors = error.errors || ['Missing errors information!'];
    this.debugError = error.debugError;
    return this;
}

Forbidden.prototype = Error.prototype;
Forbidden.constructor = Forbidden;

module.exports = Forbidden;