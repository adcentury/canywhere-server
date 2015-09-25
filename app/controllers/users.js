var mongoose = require('mongoose');
var User = mongoose.model('User');
var jwt = require('jwt-simple');
var config = require('../../config/config');

exports.logout = function(req, res) {
  req.logout();
  res.json({
    'result': 'success'
  });
}

/**
 * Create user
 */
exports.create = function(req, res) {
  var user = new User(req.body);
  user.provider = 'local';
  user.save(function(err) {
    if (err) {
      var messages = [], errors = err.errors;
      for (var k in errors) {
        messages.push(errors[k].message);
      }
      return res.json({
        'result': 'error',
        'messages': messages
      });
    }
    return res.json({
      'result': 'success'
    });
  });
}

exports.session = function(req, res) {
  var payload = {sub: req.user.uuid};
  var token = jwt.encode(payload, config.secret);
  res.json({
    'result': 'success',
    'uuid': req.user.uuid,
    'token': token
  });
};
