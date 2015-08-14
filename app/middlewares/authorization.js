
/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  // if (req.body.strategy === 'local') {
  //   return passport.authenticate('local', {session: false})(req, res, next);
  // }
  if (req.isAuthenticated()) return next()
  // // if (req.method == 'GET') req.session.returnTo = req.originalUrl
  // // res.redirect('/login')
  res.status(401).send('认证未通过');
}
