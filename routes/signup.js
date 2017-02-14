var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/userController');

router.get('/', function (req, res, next) {
  res.render('signup', { info: {}});
});

router.post('/', user_controller.user_register_post);

module.exports = router;
