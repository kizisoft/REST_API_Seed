'use strict';

module.exports = function (config) {
    return (function () {

        function BaseViewModel(schema) {
            this._schema = schema;
            this._errors = null;
            return this;
        }

        BaseViewModel.prototype.isValid = function () {
            var prop,
                viewModelsValidator = require(config.server.VIEW_MODELS_VALIDATOR_FOLDER);
            this._errors = [];
            for (prop in this._schema) {
                if (this._schema.hasOwnProperty(prop)) {
                    var error = viewModelsValidator.validate(prop, this);
                    if (error) {
                        this._errors.push(error);
                    }
                }
            }

            return this._errors.length === 0;
            // return true;
        };

        BaseViewModel.prototype.copyTo = function (obj) {
            for (var prop in this._schema) {
                if (this._schema.hasOwnProperty(prop)) {
                    obj[prop] = this[prop];
                }
            }
        };

        BaseViewModel.prototype.getErrorMessages = function () {
            if (this._errors === null) {
                this.isValid();
            }

            return this._errors;
        };

        return BaseViewModel;
    }());
};