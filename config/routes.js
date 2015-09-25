module.exports = function(app, passport, config) {
  
  var controllerPath = config.root + '/app/controllers/';
  var middlewarePath = config.root + '/app/middlewares/';

  var welcome = require(controllerPath + 'welcome');
  var users = require(controllerPath + 'users');

  // user routes
  app.get('/logout', users.logout);
  app.post('/users', users.create);
  app.post(
    '/users/session',
    passport.authenticate('local', {session: false}),
    users.session
  );

  // Error handling
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
  });
};
