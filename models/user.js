var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema(
  {
      username: { type:String, required:true, max:16 },
      password: { type: String, required:true, max:16 }
  }
);

UserSchema
.virtual('url')
.get(function (){
  return '/user/' + this._id;
});

module.exports = mongoose.model('User', UserSchema);
