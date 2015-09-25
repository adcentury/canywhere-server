var cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var socketIoAuth = require('./socketio-auth/jwt');

var env = process.env.NODE_ENV || 'development';

module.exports = function(app, io, passport, config) {
  app.use(cors());

  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';
  
  // Use log
  app.use(morgan('dev'));

  // body parser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(passport.initialize());

  io.use(socketIoAuth);
};
