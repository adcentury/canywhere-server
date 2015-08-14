

var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose');
  passport = require('passport');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

// Bootstrap models
var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});

// Bootstrap passport config
require('./config/passport')(passport, config);

// Bootstrap express app and socket io settings
require('./config/express.io')(app, io, passport, config);

// Bootstrap routes for express
require('./config/routes')(app, passport, config);

// Bootstrap namespaces for socket io
require('./config/namespaces')(io, passport, config);

server.listen(config.port);
console.log('Listening to localhost:' + config.port);
// app.listen(config.port);

