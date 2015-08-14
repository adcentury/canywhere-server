var mongoose = require('mongoose');
var crypto = require('crypto');
var uuid = require('uuid');

var Schema = mongoose.Schema;
var oAuthTypes = [
  'weixin',
  'weibo'
];

var UserSchema = new Schema({
  name: { type: String, default: ''},
  email: { type: String, default: ''},
  mobile: { type: String, default: ''},
  username: { type: String, default: ''},
  provider: { type: String, default: ''},
  hashed_password: { type: String, default: ''},
  salt: { type: String, default: '' },
  authToken: { type: String, default: '' },
  uuid: { type: String, default: uuid.v1() },
  createAt: { type: Date, default: Date.now }
});

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() {
    return this._password;
  });

var validatePresenceOf = function(value) {
  return value && value.length;
};

// UserSchema.path('email').validate(function (email, fn) {
//   var User = mongoose.model('User');
//   if (this.skipValidation()) fn(true);

//   if (!email.length) fn(true);

//   // Check only when it is a new user or when email field is modified
//   if (this.isNew || this.isModified('email')) {
//     User.find({ email: email }).exec(function (err, users) {
//       fn(!err && users.length === 0);
//     });
//   } else {
//     fn(true);
//   }
// }, '电子邮箱已存在');

UserSchema.path('username').validate(function (username) {
  if (this.skipValidation()) return true;
  return username.length;
}, '用户名不能为空');

UserSchema.path('username').validate(function (username, fn) {
  var User = mongoose.model('User');
  if (this.skipValidation())  fn(true);

  if (this.isNew) {
    User.find({username: username}).exec(function(err, users) {
       fn(!err && users.length === 0);
    })
  } else {
     fn(true);
  }
}, '用户名已存在');

UserSchema.path('hashed_password').validate(function (hashed_password) {
  if (this.skipValidation()) return true;
  return hashed_password.length;
}, '密码不能为空');

UserSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.password) && !this.skipValidation()) {
    next(new Error('密码错误！'));
  } else {
    next();
  }
});

UserSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },

  /**
   * Validation is not required if using OAuth
   */

  skipValidation: function() {
    return ~oAuthTypes.indexOf(this.provider);
  }
};

UserSchema.statics = {

  /**
   * Load
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  load: function (options, cb) {
    options.select = options.select || 'name username uuid';
    this.findOne(options.criteria)
      .select(options.select)
      .exec(cb);
  }
}

mongoose.model('User', UserSchema);