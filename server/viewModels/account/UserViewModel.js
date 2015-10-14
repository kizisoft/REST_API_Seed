'use strict';

module.exports = function (config) {
    var BaseViewModel = require('../BaseViewModel')(config);

    function UserViewModel(user) {
        user = user || {};
        BaseViewModel.call(this, UserViewModel.schema);
        this.username = user.username || '';
        this.firstName = user.firstName || '';
        this.lastName = user.lastName || '';
        this.password = user.password || '';
        this.confirmPassword = user.confirmPassword || '';
        this.address = {city: 'Sofia', street: 'Jeko Voivoda', number: 5};
        return this;
    }

    UserViewModel.prototype = BaseViewModel.prototype;
    UserViewModel.constructor = UserViewModel;

    UserViewModel.schema = {
        username: {},
        firstName: {},
        lastName: {},
        password: {},
        confirmPassword: {},
        address: {}
    };

    return UserViewModel;
};