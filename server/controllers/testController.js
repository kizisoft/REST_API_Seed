'use strict';

module.exports = function (config, data) {
    var throwMy = require('../utilities/throwMy');

    function getTest(req, res) {
        res.status(200).json({error: false, test: 'getTest passed!'});
    }

    function postTest(req, res) {
        res.status(200).json({error: false, test: 'postTest passed!'});
    }

    return {
        getTest: getTest,
        postTest: postTest
    };
};