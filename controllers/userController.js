var User = require('../models/user');
// USER GET by POST finds the provided usernames corresponding database object and validates the password
//
// ? is there a way to (res.)set 'info' to the corresponding value w/o rerendering the form? there must be right?

exports.user_get_post = function (req, res, next) {

  // VALIDATION of req.body.username
  // i have a feeling this is not good practice at all.
  // maybe export the validation into ../validations/login.js?
  req.checkBody('username', 'invalid username').isAlpha()
  var errors = req.validationErrors();
  if (errors) {  res.render('login', { info: "username can only contain alphanumeric characters" }) }

  // if errors is true the response ends with an error message
  // so i feel it's save to omit the else statement for clarity reasons
  // also: isn't this a blocking operation? async.js? i dont quite understand blocking yet.
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

  req.checkBody('username', 'username needs to be alphanumeric').isAlpha();
  req.checkBody('password1', 'password needs to be alphanumeric').isAlpha();
  req.checkBody('email', 'password needs to be alphanumeric').isEmail();

    var errorsObjectParsed = function () {
      var errorsObject = req.validationErrors();
      var results = []
      for (k in errorsObject) {
        results.push(errorsObject[k].msg);
      }
      return results;
    }
    res.render('signup', {  info: errorsObjectParsed()  });
}
