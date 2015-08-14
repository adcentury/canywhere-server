var express = require('express');
var session = require('express-session');

var glob = require('glob');

var cors = require('cors');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var exphbs  = require('express-handlebars');
var flash = require('connect-flash');

var MongoStore = require('connect-mongo')(session);
var config = require('./config');

var passportSocketIo = require('passport.socketio');

var env = process.env.NODE_ENV || 'development';
var mStore = new MongoStore({
  url: config.db,
  collection: 'sessions'
});

module.exports = function(app, io, passport, config) {

  app.use(cors({
    origin: config.origin,
    credentials: true
  }));
  // Compress middleware
  app.use(compress({
    threshold: 512
  }));

  app.use(express.static(config.root + '/public'));

  // Set views path and template engine
  app.engine('handlebars', exphbs({
    layoutsDir: config.root + '/app/views/layouts/',
    defaultLayout: 'main',
    partialsDir: [config.root + '/app/views/partials/']
  }));
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'handlebars');

  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  app.use(favicon(config.root + '/public/img/favicon.png'));
  
  // Use log
  app.use(logger('dev'));

  // body parser
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(methodOverride());

  app.use(cookieParser());

  app.use(session({
    key: config.app.name + '.sid',
    resave: true,
    saveUninitialized: true,
    secret: config.app.name,
    store: mStore
  }));

  app.use(flash());

  // Use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,
    key: config.app.name + '.sid',
    secret: config.app.name,
    store: mStore,
    passport: passport
  }));

};
