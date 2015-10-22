'use strict';

module.exports = function (app, config, data) {
    var testController = require('../../controllers/testController')(config, data),
        auth = require('../../middlewares/auth')(config);

    app.route(config.server.DEFAULT_API_ROUTE + '/test/')
        .get(testController.getTest)
        .post(auth.isAuthorized, testController.postTest);
};