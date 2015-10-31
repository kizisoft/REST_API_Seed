'use strict';

module.exports = function (app, config, data) {
    var accountController = require('../../controllers/accountController')(config, data),
        auth = require('../../middlewares/auth')(config);

    app.route(config.server.DEFAULT_API_ROUTE + '/auth/register/:provider/')
        .post(auth.isNotAuthorized, accountController.postRegisterSocial);

    app.route(config.server.DEFAULT_API_ROUTE + '/auth/register/')
        .post(auth.isNotAuthorized, accountController.postRegister);

    app.route(config.server.DEFAULT_API_ROUTE + '/auth/login/:provider/')
        .post(auth.isNotAuthorized, accountController.postLogin);

    app.route(config.server.DEFAULT_API_ROUTE + '/auth/logout/')
        .put(auth.isAuthorized, accountController.putLogout);
};