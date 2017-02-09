var mongoose = require('mongoose');
var mongoDB = '127.0.0.1/authenticater';
var User = require('./models/user');

mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongoDB connection error:'));

var testuser = new User({
  username: 'testuser',
  password: 'testpassword'
})

testuser.save(function (err, testuser) {
  if (err) return console.error(err);
  console.log(testuser.username);
});
