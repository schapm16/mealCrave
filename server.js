var express = require("express");
var app = express();
var handlebars = require("express-handlebars");

//connectiong handlebars engine to express server
app.set("view engine", "handlebars");
var path = require("path");

//making "public" folder realy public for client side
app.use(express.static(path.join(__dirname, 'public')));

//connecting bodyparsers to express server
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var controllers = require("./controllers");
var apiRoutes = require("./routes/api_routes.js");
var htmlRoutes = require("./routes/html_routes.js");


var PORT = process.env.PORT || 8080;
app.listen(PORT, function(){
	console.log("Server started at "+PORT);
})