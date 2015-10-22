'use strict';

var http = require('http');
http.IncomingMessage.prototype.isAuthorized = function () {
    if (!this._identity) {
        throw new Error('Identity must be initialized!');
    }
    return !!this.user;
};