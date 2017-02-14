var User = require('../models/user');
var async = require('async');

var errorsParser = function (req) {
  let errors = req.validationErrors();
  let results = [];
  for (let k in errors) {
    results.push(errors[k].msg);
  }
  return results;
};
// USER GET by POST finds the provided usernames corresponding database object and validates the password
//
// ? is there a way to (res.)set 'info' to the corresponding value w/o rerendering the form? there must be right?

exports.user_get_post = function (req, res, next) {
  req.checkBody('username', 'Username needs to be alphanumeric').isAlpha();
  let errors = errorsParser(req, res, next);
  if (errors.length>0) {  res.render('login', { info: errors }); }

  User.findOne({ 'username': req.body.username }, 'username password', function(err, user){
    if (err) {
      return next(err);
    } else if (!user) {
      res.render('login', { info: 'User not found.' });
    } else if (user.password === req.body.password){
      req.session.loggedIn = true;
      res.render('logout', { info: 'you successfully logged in!' });
    } else if (user.password != req.body.password){
      res.render('login', { info: 'You provided the wrong Password' });
    } else {
      res.render('login', { info: 'Apparently something unexpected went wrong, this is embarassing.' });
    }
  });
};

// USER REGISTER by POST
//
// needs to generate a user by provided POST data, check database for duplicates, respond accordingly and
// push a new user object into the database. needs to initialize email verification process.

exports.user_register_post = function (req, res, next) {
  req.checkBody('username', 'Username needs to be alphanumeric').isAlpha();
  req.checkBody('password1', 'Password needs to be alphanumeric').isAlpha();
  req.checkBody('email', 'E-mail needs to be a valid email address').isEmail();
  req.checkBody('password2', 'Passwords need to match').isEqual(req.body.password1);

  async.parallel({
    username: function(callback) {
      User.findOne({  'username': req.body.username  }, 'username', function(err, user){
        if (err) {  return next(err);
        } else {
          if(user != null) {
            if (user.username === req.body.username){
              callback(err, 'Username is already taken.');
            }
          } else {
            callback();
          }
        }
      });
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
      });
    },
  }, function(err, asyncResults) {
    let errors = errorsParser(req, res, next);
    if (err) {  return next(err);
    } else if (errors.length>0) {
      res.render('signup', { info: errors });
    } else if (asyncResults.username) {
      res.render('signup', {  info:  asyncResults});
      return;
    } else if (asyncResults.email) {
      res.render('signup', {  info:  asyncResults});
      return;
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
          res.render('signup', {  info: ['Signup successful. you can now log in using your username and password.'] });
        }
      });
    }
  });
};

exports.user_logout_post = function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
};
