var mongoose = require('mongoose');
var jwtAuth = require('socketio-jwt-auth');
var User = mongoose.model('User');
var config = require('../config');

module.exports = jwtAuth.authenticate({
  secret: config.secret
}, function(payload, done) {
  var options = {
    criteria: { uuid: payload.sub },
    select: 'name username email uuid'
  };
  User.load(options, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, '无此用户');
    }
    return done(null, user);
  })
});
