var cfg,
    data,
    CONTROLLER_NAME = 'account',
    passport = require('passport'),
    UserViewModel = require('./UserViewModel'),
    encryption = require('../utilities/encryption');

function localStrategy(req, res, next) {
    var auth = passport.authenticate('local', function (err, user) {
        if (err) {
            next(err);
        } else if (!user) {
            showError(req, res, cfg.errors.WRONG_USERNAME_OR_PASSWORD, req.originalUrl);
        } else {
            req.logIn(user, function (err) {
                if (err) {
                    next(err);
                } else {
                    var redirectPath = req.query.returnUrl || '/';
                    res.redirect(redirectPath);
                }
            });
        }
    });
    auth(req, res, next);
}

function googleStrategy(req, res, next) {
    var auth = passport.authenticate('google', {scope: cfg.GOOGLE_OAUTH2_SCOPE, state: 'google'}, function () {
        // The request will be redirected to Google for authentication, so this
        // function will not be called.
    });
    auth(req, res, next);
}

function authenticateGoogle(req, res, next) {
    var auth = passport.authenticate('google', function (err, providerData) {
        if (err) {
            next(err);
        } else if (!providerData) {
            showError(req, res, cfg.errors.AUTHENTICATION_FAILED, '/login');
        } else {
            data.userLogins.getBy({providerId: providerData.id})
                .then(function (userLoginsDb) {
                    if (!userLoginsDb[0]) {
                        req.session.providerData = providerData;
                        res.redirect('/register/oauth2');
                    } else {
                        req.logIn(userLoginsDb[0].user, function (err) {
                            if (err) {
                                showError(req, res, err, '/login');
                            } else {
                                res.redirect('/');
                            }
                        });
                    }
                }).catch(function (err) {
                    showError(req, res, cfg.errors.AUTHENTICATION_FAILED, '/login');
                });
        }
    });
    auth(req, res, next);
}

module.exports = function (dataIn) {
    data = dataIn.data;
    cfg = dataIn.config.authCtrl();
    return {
        moduleName: CONTROLLER_NAME,
        data: {
            getRegister: function (req, res) {
                res.render(CONTROLLER_NAME + '/register', {csrfToken: req.csrfToken()});
            },
            postRegister: function (req, res) {
                var userViewModel = new UserViewModel(req.body),
                    newUserData = {};
                if (userViewModel.isValid()) {
                    newUserData.username = userViewModel.username;
                    newUserData.firstName = userViewModel.firstName;
                    newUserData.lastName = userViewModel.lastName;
                    newUserData.salt = encryption.generateSalt();
                    newUserData.hashPass = encryption.generateHashedPassword(newUserData.salt, userViewModel.password);
                    data.users.add(newUserData)
                        .then(function (userDb) {
                            req.logIn(userDb, function (err) {
                                if (err) {
                                    showError(req, res, err, '/register', userViewModel);
                                } else {
                                    res.redirect('/');
                                }
                            });
                        }).catch(function (err) {
                            showError(req, res, err, '/register', userViewModel);
                        });
                } else {
                    showError(req, res, userViewModel.getErrors(), '/register', userViewModel);
                }
            },
            getLogin: function (req, res) {
                res.render(CONTROLLER_NAME + '/login');
            },
            postLogin: function (req, res, next) {
                if (req.body.provider) {
                    switch (req.body.provider.toLowerCase()) {
                        case 'google':
                            googleStrategy(req, res, next);
                            break;
                        default :
                            showError(req, res, cfg.errors.UNKNOWN_PROVIDER);
                            break;
                    }
                } else {
                    localStrategy(req, res, next);
                }
            },
            getCallbackOauth2: function (req, res, next) {
                switch (req.query.state) {
                    case 'google':
                        authenticateGoogle(req, res, next);
                        break;
                    default :
                        showError(req, res, cfg.errors.UNKNOWN_PROVIDER);
                        break;
                }
            },
            getRegisterOauth2: function (req, res) {
                var providerData = req.session.providerData || null;
                if (providerData) {
                    res.render(CONTROLLER_NAME + '/registerOauth2', {
                        firstName: providerData.name.givenName,
                        lastName: providerData.name.familyName
                    });
                } else {
                    showError(req, res, cfg.errors.AUTHENTICATION_FAILED, '/login');
                }
            },
            postRegisterOauth2: function (req, res) {
                if (req.body.username) {
                    data.users.add({
                        username: req.body.username,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName
                    }).then(function (userDb) {
                        var providerData = req.session.providerData || null;
                        data.userLogins.add({
                            user: userDb,
                            providerId: providerData.id,
                            provider: providerData.provider
                        }).then(function (userLoginDb) {
                            req.logIn(userDb, function (err) {
                                if (err) {
                                    showError(req, res, err, '/login');
                                } else {
                                    res.redirect('/');
                                }
                            });
                        }).catch(function (err) {
                            showError(req, res, cfg.errors.AUTHENTICATION_FAILED, '/login');
                        });
                    }).catch(function (err) {
                        showError(req, res, cfg.errors.AUTHENTICATION_FAILED, '/login');
                    });
                } else {
                    showError(req, res, cfg.errors.USERNAME_IS_REQUIRED, '/register/oauth2');
                }
            },
            logout: function (req, res) {
                req.logout();
                res.redirect('/');
            }
        }
    };
};