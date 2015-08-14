module.exports = function(app, passport, config) {
  
  var controllerPath = config.root + '/app/controllers/';
  var middlewarePath = config.root + '/app/middlewares/';

  var welcome = require(controllerPath + 'welcome');
  var users = require(controllerPath + 'users');

  var auth = require(middlewarePath + 'authorization');

  // user routes
  // app.get('/login', users.login);
  // app.get('/signup', users.signup);
  app.get('/logout', users.logout);
  app.post('/users', users.create);
  app.post(
    '/users/session',
    passport.authenticate('local'),
    users.session
  );

  app.get('/test', auth.requiresLogin, users.test);

  // default views
  app.get('/', welcome.index);

  // Error handling
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });
};