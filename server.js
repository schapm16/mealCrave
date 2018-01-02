var express = require("express");
var app = express();
var handlebars = require("express-handlebars");
const session = require('express-session');
var passport = require('passport');
var cookieParser  = require("cookie-parser");
app.use(cookieParser());
var RedisStore = require('connect-redis')(session)

var LocalStrategy  = require('passport-local').Strategy;
//connectiong handlebars engine to express server
app.set("view engine", "handlebars");
app.engine("handlebars", handlebars({ defaultLayout: "main" }));

var path = require("path");

//making "public" folder realy public for client side
app.use(express.static(path.join(__dirname, 'public')));

//connecting bodyparsers to express server
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//path for temporary saving photos
app.use(bodyParser({uploadDir:'/uploads/'}));
app.use(session({ secret: 'SECRET' }));

// Passport:
app.use(passport.initialize());
app.use(passport.session());

var controllers = require("./controllers/index.js")(app);

passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
}, function(username, password,done){
	User.findOne({ username : username},function(err,user){
		return err 
		? done(err)
		: user
		? password === user.password
		? done(null, user)
		: done(null, false, { message: 'Incorrect password.' })
		: done(null, false, { message: 'Incorrect username.' });
	});
}));

var PORT = process.env.PORT || 8080;
app.listen(PORT, function(){
	console.log("Server started at "+PORT);
})