var User = require('../models/user');

// USER GET by POST finds the provided usernames corresponding database object and validates the password
//
// needs to sanitize the provided data and actually respond to all possible inputs
// (ie typos, no user found, required fields etc.)
// ? is there a way to (res.)set 'info' to the corresponding value w/o rerendering the form? there must be right?

exports.user_get_post = function (req, res, next) {

  // VALIDATION of req.body.username
  // i have a feeling this is not good practice at all.
  // maybe export the validation into ../validations/login.js?
  req.checkBody('username', 'invalid username').isAlpha().isEmpty()
  var errors = req.validationErrors();
  if (errors) {  res.render('login', { info: "username can only contain alphanumeric characters" }) }

  // if errors is true the response ends with an error message
  // so i feel it's save to omit the else statement for clarity reasons
  // VALID DATA so process:
  User.findOne({ 'username': req.body.username }, 'username password', function(err, user){
    if (err) {
      return next(err);
    } else if (!user) {
      res.render('login', { info: "User not found." });
    } else if (user.password === req.body.password){
      res.render('login', { info: "While the server accepted your login, this doesn't benefit you in any way as of yet" });
    } else if (user.password != req.body.password){
      res.render('login', { info: "You provided the wrong Password" });
    } else {
      res.render('login', { info: "Apparently something unexpected went wrong, this is embarassing." });
    }
  })

}

// USER REGISTER by POST
//
// needs to generate a user by provided POST data, check database for duplicates, respond accordingly and
// push a new user object into the database. needs to initialize email verification process.

exports.user_register_post = function (req, res, next) {
  res.send('NOT IMPLEMENTED: User signup process controller');
}
