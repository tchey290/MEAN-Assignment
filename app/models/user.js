// user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserDetail = new Schema({
    username: String,
    password: String
}, {collection: 'employees'});

var UserDetails = mongoose.model('userInfo',UserDetail);