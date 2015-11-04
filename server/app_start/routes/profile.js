'use strict';

module.exports = function (app, config, data) {
    var profileController = require('../../controllers/profileController')(config, data),
        auth = require('../../middlewares/auth')(config);

    app.route(config.server.DEFAULT_API_ROUTE + '/profile/logins/:provider')
        .post(auth.isAuthorized, profileController.addLogin);

    app.route(config.server.DEFAULT_API_ROUTE + '/profile/logins/')
        .get(auth.isAuthorized, profileController.getLogins)
        .post(auth.isAuthorized, profileController.setLocalPassword)
        .put(auth.isAuthorized, profileController.changeLocalPassword);

    app.route(config.server.DEFAULT_API_ROUTE + '/profile/logins/:id')
        .delete(auth.isAuthorized, profileController.deleteLogin);

    app.route(config.server.DEFAULT_API_ROUTE + '/profile/edit/:id')
        .post(auth.isAuthorized, profileController.changeProfile);

    app.route(config.server.DEFAULT_API_ROUTE + '/profile/:id')
        .get(auth.isAuthorized, profileController.getProfile);
};