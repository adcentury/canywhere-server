var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('User');

module.exports = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  }, 
  function(username, password, done) {
    var options = {
      criteria: { username: username },
      select: 'name username email hashed_password salt uuid'
    };
    User.load(options, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: '用户尚未注册' });
      }
      if (!user.authenticate(password)) {
        return done(null, false, { message: '密码错误' });
      }
      return done(null, user);
    });
  }
);