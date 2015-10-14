'use strict';

module.exports = function (config) {
    var BaseViewModel = require('../BaseViewModel')(config);

    function UserInputModel(user) {
        user = user || {};
        BaseViewModel.call(this, UserInputModel.schema);
        this.username = user.username || '';
        this.firstName = user.firstName || '';
        this.lastName = user.lastName || '';
        this.password = user.password || '';
        this.confirmPassword = user.confirmPassword || '';
        return this;
    }

    UserInputModel.prototype = BaseViewModel.prototype;
    UserInputModel.constructor = UserInputModel;

    UserInputModel.schema = {
        username: {
            type: ['string', 'Username is not a string!'],
            required: 'Username is required!',
            minLength: 5,
            maxLength: 30
        },
        firstName: {
            type: ['string', 'First name is not a string!'],
            required: 'First name is required!',
            minLength: 2,
            maxLength: 30
        },
        lastName: {
            type: ['string', 'Last name is not a string!'],
            required: 'Last name is required!',
            minLength: 2,
            maxLength: 30
        },
        password: {
            type: ['string', 'Password is not a string!'],
            required: 'Password is required!',
            minLength: 3,
            maxLength: 30
        },
        confirmPassword: {
            type: ['string', 'Username is not a string!'],
            required: 'Confirmation password is required!',
            minLength: 3,
            maxLength: 30,
            compare: ['password', 'The password and confirmation password do not match!']
        }
    };

    return UserInputModel;
};