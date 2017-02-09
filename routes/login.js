var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/userController');

// GET login
router.get('/', function (req, res, next) {
  console.log('login route accessed');
  res.render('login');
});

router.post('/', user_controller.user_get_post);


module.exports = router;
