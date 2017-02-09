var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/userController');

// GET signup
router.get('/', function (req, res, next) {
  console.log('signup route accessed');
  res.render('signup');
})

// POST signup --> user controller
router.post('/', user_controller.user_register_post);

module.exports = router;
