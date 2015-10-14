'use strict';

var fs = require('fs'),
    path = require('path');

function load(dirName) {
    var i,
        fullFileName,
        files = fs.readdirSync(dirName),
        length = files.length,
        params = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : [];
    for (i = 0; i < length; i += 1) {
        if (files[i].toLowerCase() !== 'index.js') {
            fullFileName = path.normalize(dirName + '\\' + files[i]);
            require(fullFileName).apply(null, params);
        }
    }
}

function loadModule(dirName) {
    var i,
        fullFileName,
        moduleExports = {},
        dataExports = {},
        files = fs.readdirSync(dirName),
        length = files.length;
    for (i = 0; i < length; i += 1) {
        if (files[i].toLowerCase() !== 'index.js' && files[i].toLowerCase().indexOf('.json') < 0) {
            fullFileName = path.normalize(dirName + '\\' + files[i]);
            moduleExports = arguments.length > 1 ? require(fullFileName).apply(null, Array.prototype.slice.call(arguments, 1)) : require(fullFileName);
            dataExports[moduleExports.moduleName] = moduleExports.data;
        }
    }

    return dataExports;
}

module.exports = {
    load: load,
    loadModule: loadModule
};