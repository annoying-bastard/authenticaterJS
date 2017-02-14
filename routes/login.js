var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/userController');

router.get('/', function (req, res, next) {
  if(req.session.loggedIn) {
    res.redirect('logout');
  } else {
    res.render('login');
  }

});

router.post('/', user_controller.user_get_post);


module.exports = router;
