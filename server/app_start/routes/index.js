'use strict';

module.exports = function (app, config, data) {
    var loader = require('../../utilities/loader');
    loader.load(__dirname, app, config, data);
};