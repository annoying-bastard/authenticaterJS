var User = require('../models/user');
var async = require('async');

var errorsParser = function (req) {
  let errors = req.validationErrors();
  let results = [];
  for (k in errors) {
    results.push(errors[k].msg);
  }
  return results;
}
// USER GET by POST finds the provided usernames corresponding database object and validates the password
//
// ? is there a way to (res.)set 'info' to the corresponding value w/o rerendering the form? there must be right?

exports.user_get_post = function (req, res, next) {
  req.checkBody('username', 'Username needs to be alphanumeric').isAlpha()
  let errors = errorsParser(req, res, next);
  if (errors.length>0) {  res.render('login', { info: errors }) }

  // if errors is true the response ends with an error message
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
    req.checkBody('username', 'Username needs to be alphanumeric').isAlpha();
    req.checkBody('password1', 'Password needs to be alphanumeric').isAlpha();
    req.checkBody('email', 'E-mail needs to be a valid email address').isEmail();
    let errors = errorsParser(req, res, next);
    if (errors.length<0) {
      res.render('signup', {  info: errors  });
    }

    // those are so ugly... there must be a better way to do this.
    // oh got this doesn't work at all... i don't know how to use
    // User.findOne({},'', (err, user) => {user.username outside of this function})
    var results = {};
    async.parallel({
        username: function(callback) {
          User.findOne({  'username': req.body.username  }, 'username', function(err, user){
            if (err) {  return next(err);
            } else {
              if(user != null) {
                if (user.username === req.body.username){
                  callback(err, 'Username is already taken');
                }
              } else {
                callback();
              }
            }
          })
        },
        email: function(callback) {
          User.findOne({  'email': req.body.email  }, 'email', function(err, user){
            if (err) {  return next(err);
            } else {
              if (user != null) {
                if (user.email === req.body.email) {
                  callback(err, 'The E-mail address is alrady taken.');
              }
            } else {
              callback();
            }
            }
          })
        },
      }, function(err, asyncResults) {
        console.log(asyncResults);
        if (err) {  return next(err);
        } else if (asyncResults.username) {
          res.render('signup', {  info:  asyncResults.username});
          return;
        } else if (asyncResults.email) {
          res.render('signup', {  info:  asyncResults.email});
          return;
        } else if (req.body.password1 != req.body.password2) {
          res.render('signup', {  info: 'The passwords you provide need to match' });
        } else {
          let newUser = new User({
            username: req.body.username,
            password: req.body.password1,
            email: req.body.email
          });
          newUser.save(function (err, newUser) {
            if (err) {
              res.render('signup', {  info: 'So sorry. a database operation went wrong. :('});
              return console.error(err);
            } else {
              res.render('signup', {  info: 'Signup successful. you can now log in using your username and password.' });
            }
          });
        }
      });

}
