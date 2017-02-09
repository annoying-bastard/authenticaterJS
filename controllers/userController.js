var User = require('../models/user');

exports.user_get_post = function (req, res, next) {
  User.findOne({ 'username': req.body.username }, 'username password', function(err, user){
      if (err) { return next(err); }
      if (user.password === req.body.password);
      res.send("while the server accepted your login, this doesn't benefit you in any way as of yet");
  })

}
