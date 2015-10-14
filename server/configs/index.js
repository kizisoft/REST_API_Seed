'use strict';

var fs = require('fs'),
    path = require('path'),
    files = fs.readdirSync(__dirname),
    length = files.length,
    config = {};

module.exports = function (env) {
    var i,
        fullFileName,
        fileName,
        configJSON;

    for (i = 0; i < length; i += 1) {
        fullFileName = path.normalize(__dirname + '\\' + files[i]);
        if (files[i].endsWith('.json')) {
            fileName = files[i].slice(0, files[i].length - 5);
            configJSON = require(fullFileName);
            config[fileName] = configJSON[env] || configJSON;
        }
    }

    return config;
};