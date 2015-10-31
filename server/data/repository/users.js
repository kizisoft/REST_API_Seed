'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User');

function createError(name, message, errors, debugError) {
    var error = new Error();
    error.name = name;
    error.message = message;
    error.errors = errors;
    error.debugError = debugError;
    error.customError = true;
    return error;
}

function add(userData) {
    return new Promise(function (resolve, reject) {
        User.create(userData, function (err, userDb) {
            var errors = [];
            if (err) {
                switch (err.name) {
                    case 'ValidationError':
                        for (var fieldError in err.errors) {
                            if (err.errors.hasOwnProperty(fieldError)) {
                                errors.push(err.errors[fieldError].message);
                            }
                        }
                        reject(createError('InternalServerError', 'Validation Error', errors, err));
                        break;
                    case 'MongoError':
                        var errToJSON = err.toJSON();
                        reject(createError('BadRequest', 'Database Error', ['Username ' + errToJSON.op.username + ' already exists!'], err));
                        break;
                    default :
                        reject(createError('InternalServerError', 'Unknown Database Error', ['Database problem occurred! Try again later.'], err));
                }
            } else {
                resolve(userDb);
            }
        });
    });
}

function all() {
    return getBy({});
}

function update(id, updates) {
    return new Promise(function (resolve, reject) {
        User.findOneAndUpdate({_id: id}, updates, {new: true}, function (err, userDb) {
            if (err) {
                reject(err);
            } else {
                resolve(userDb);
            }
        })
    });
}

function del() {

}

function getBy(option) {
    return new Promise(function (resolve, reject) {
        User.find(option, function (err, usersDb) {
            if (err) {
                reject(err);
            } else {
                resolve(usersDb);
            }
        });
    });
}

module.exports = {
    moduleName: 'users',
    data: {
        add: add,
        all: all,
        update: update,
        del: del,
        getBy: getBy
    }
};