var User = require('../models/user');

// USER GET by POST finds the provided usernames corresponding database object and validates the password
//
// needs to sanitize the provided data and actually respond to all possible inputs
// (ie typos, no user found, required fields etc.)

exports.user_get_post = function (req, res, next) {
  User.findOne({ 'username': req.body.username }, 'username password', function(err, user){
      if (err) {
        return next(err);
      } else if (!user) {
        res.send("User not found.");
      } else if (user.password === req.body.password){
        res.send("while the server accepted your login, this doesn't benefit you in any way as of yet");
      } else if (user.password != req.body.password){
        res.send("You provided the wrong Password");
      } else {
        res.send("Apparently something went wrong, this is embarassing.");
      }
  })

}

// USER REGISTER by POST
//
// needs to generate a user by provided POST data, check database for duplicates, respond accordingly and
// push a new user object into the database. needs to initialiye email verification process.

exports.user_register_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED: User signup process controller');
  console.log(req.body);
}
