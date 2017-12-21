var express = require("express");
var app = express();
var handlebars = require("express-handlebars");
var session = require("express-session");
// Requiring passport as we've configured it
var passport = require("./config/passport");

//connectiong handlebars engine to express server
app.set("view engine", "handlebars");
app.engine("handlebars", handlebars({ defaultLayout: "main" }));

var path = require("path");

//config middleware for authentication
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

//making "public" folder realy public for client side
app.use(express.static(path.join(__dirname, 'public')));

//connecting bodyparsers to express server
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

var controllers = require("./controllers/index.js")(app);

var PORT = process.env.PORT || 8080;
app.listen(PORT, function() {
	console.log("Server started at " + PORT);
})
