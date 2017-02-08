var express = require('express');
var router = express.Router();

// GET login
router.get('/', function (req, res, next) {
  console.log('login route accessed');
  res.render('login');
})

module.exports = router;
