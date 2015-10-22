'use strict';

var crypto = require('crypto');

function generateSalt() {
    return crypto.randomBytes(128).toString('base64');
}

function generateHashedPassword(salt, pwd) {
    var hmac = crypto.createHmac('sha1', salt);
    return hmac.update(pwd).digest('hex');
}

function generateToken() {
    return crypto.randomBytes(70)
        .toString('base64')
        .slice(0, 64)
        .replace(/\+/g, '0')  // replace '+' with '0'
        .replace(/\//g, '0'); // replace '/' with '0'
}

module.exports = {
    generateSalt: generateSalt,
    generateHashedPassword: generateHashedPassword,
    generateToken: generateToken
};