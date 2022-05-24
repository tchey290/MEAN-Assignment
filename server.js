//setup server modules
var fs = require('fs');
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local' ).Strategy;
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

//connect to database
//REDACTED databse info - need secure credential storage
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
 console.log("connected");
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'topsecret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers",
 "Origin, X-Requested-With, Content-Type, Accept");
 next();
}); 

//add our routes
require('./app/routes')(app);
require('./app/booksAPI')(app);
require('./app/employeesAPI')(app); 
require('./app/loginAPI')(app, passport);
require('./app/todoAPI')(app);

require('./app/messagesAPI')(app);

// user schema/model
// user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserDetail = new Schema({
    username: String,
    password: String
}, {collection: 'employees'});

var UserDetails = mongoose.model('userInfo',UserDetail);

// configure passport
passport.use(new localStrategy(function(username, password, done)
{
    process.nextTick(function ()
    {
        UserDetails.findOne({'username':username}, function(err, user)
        {
            if (err) { return done(err); }
			if (!user) { return done(null, false); }
			if (user.password != password) { return done(null, false); }
			return done(null, user);
		});
    });
  }
));
passport.serializeUser(function(user, done)
{
    done(null, user);
});
passport.deserializeUser(function(user, done)
{
    done(null, user);
});

// start server
app.listen(3000);