'use strict';

function validate(prop, obj) {
    if (!prop || !obj || !obj._schema) {
        throw new ReferenceError('Incorrect input parameters');
    }

    var schema = obj._schema[prop];
    if (!schema.type || schema.type.length === 0 || schema.type[0] == '') {
        throw new ReferenceError('The schema type is missing!');
    }

    switch (schema.type[0]) {
        case 'string':
            return validateString(prop, obj);
        case 'number':
            return validateNumber(prop, obj);
        default :
            throw new ReferenceError('Validator does not support type "' + schema.type[0] + '"');
    }
}

function validateString(prop, obj) {
    var schema = obj._schema[prop],
        val = obj[prop];
    if (schema.required && (val === '' || !val)) {
        return schema.required
    }

    if (!( typeof val === 'string' || val instanceof String)) {
        return schema.type[1]
    }

    if (schema.compare && obj[prop] !== obj[schema.compare[0]]) {
        return schema.compare[1]
    }
}

function validateNumber(prop, obj) {
    throw new SyntaxError('Function "validateNumber" is not implemented!');
}

module.exports = {
    validate: validate
};