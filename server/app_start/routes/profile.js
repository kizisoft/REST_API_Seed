'use strict';

module.exports = function (app, config, data) {
    var profileController = require('../../controllers/profileController')(config, data),
        auth = require('../../middlewares/auth')(config);

    app.route(config.server.DEFAULT_API_ROUTE + '/profile/logins/:provider')
        .post(auth.isAuthorized, profileController.addLogin);

    app.route(config.server.DEFAULT_API_ROUTE + '/profile/logins/')
        .get(auth.isAuthorized, profileController.getLogins);

    app.route(config.server.DEFAULT_API_ROUTE + '/profile/logins/:id')
        .delete(auth.isAuthorized, profileController.deleteLogin);
};