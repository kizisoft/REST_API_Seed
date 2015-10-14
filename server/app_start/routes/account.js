'use strict';

module.exports = function (app, config, data) {
    var accountController = require('../../controllers/accountController')(config, data),
        auth = require('../../middlewares/auth')(config);

    app.route(config.server.DEFAULT_API_ROUTE + '/auth/register/:provider/')
        .post(accountController.postRegister);

    app.route(config.server.DEFAULT_API_ROUTE + '/auth/login/:provider/')
        .post(auth.authenticate, accountController.postLogin);

    app.route('/get/')
        .get(accountController.test);
};