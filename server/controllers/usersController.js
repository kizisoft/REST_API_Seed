var data,
    User = require('mongoose').model('User'),
    CONTROLLER_NAME = 'users';

module.exports = function (dataIn) {
    data = dataIn.data;
    return {
        moduleName: CONTROLLER_NAME,
        data: {
            getAll: function (req, res) {
                data.users.all().then(function (collection) {
                    res.send(collection);
                }).catch(function (err) {
                    console.log('Users could not be loaded: ' + err);
                });
            }
        }
    }
};