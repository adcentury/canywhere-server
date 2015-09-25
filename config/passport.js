var local = require('./passport/local');

module.exports = function(passport) {
  passport.use(local);
};
