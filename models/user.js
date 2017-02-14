var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// the monoose User Schema contructor. it will be used to create new entries or query existing ones in mongodb
var UserSchema = Schema(
  {
    username: { type:String, required:true, max:16 },
    password: { type: String, required:true, max:16 },
    email: {type: String, required:true}
  }
);

// this virtual provides a URL to reference unique users and render them to the browser if needed
UserSchema
.virtual('url')
.get(function (){
  return '/user/' + this._id;
});

module.exports = mongoose.model('User', UserSchema);
