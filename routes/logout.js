var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/userController');

router.get('/', function (req, res, next) {
  res.render('logout', {  info: 'You are already logged in!'  });

});

router.post('/', user_controller.user_logout_post);


module.exports = router;
