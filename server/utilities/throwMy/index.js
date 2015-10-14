'use strict';

var i,
    fileName,
    fs = require('fs'),
    errors = fs.readdirSync(__dirname + '/errors'),
    length = errors.length;

for (i = 0; i < length; i += 1) {
    fileName = errors[i].slice(0, errors[i].indexOf('.'));
    module.exports[fileName] = require('./errors/' + errors[i]);
}