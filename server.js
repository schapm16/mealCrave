var express = require("express");
var app = express();
var handlebars = require("express-handlebars");

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

var controllers = require("./controllers/index.js")(app);

//amazon s3 ORM
var amazon = require("./models/amazon.js");
var testUrl = amazon.sendPhotoAndGetURL("./uploads/neo.jpg", "neo.jpg", function(url){
	console.log(result);
});


var PORT = process.env.PORT || 8080;
app.listen(PORT, function(){
	console.log("Server started at "+PORT);
})