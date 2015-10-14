'use strict';

if (!Date.prototype.addDays) {
    Date.prototype.addDays = function (days) {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    };
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        var subjectString = this.toString();
        if (position === undefined || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}

if (!JSON.tryParse) {
    JSON.tryParse = function (jsonString) {
        try {
            var obj = JSON.parse(jsonString);
            if (obj && typeof obj === "object" && obj !== null) {
                return obj;
            }
        }
        catch (e) {
        }

        return false;
    };
}