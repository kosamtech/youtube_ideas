module.exports = {
  auth: function(req, res, next){
    if(req.isAuthenticated()) {
      return next();
    } else {
      req.flash('error', 'Not Authorized!');
      res.redirect('/users/login')
    };
  }
}