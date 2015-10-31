var https = require('https'),
    fs = require('fs'),
    hskey = fs.readFileSync('privatekey.key'),
    hscert = fs.readFileSync('certificate.crt'),
    credentials = {
        key: hskey,
        cert: hscert
    };

require('./server/utilities/extensions');

var express = require('express'),
    env = process.env.NODE_ENV || 'development',
    app = express(),
    config = require('./server/configs')(env),
    port = config.server.PORT || process.env.PORT,
    appStart = require('./server/app_start');

appStart(app, config);
//app.listen(port);

var server = https.createServer(credentials, app);
server.listen(port);

console.log('Server running on port: ' + port);