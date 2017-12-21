console.log("Controllers: \x1b[32mok!\x1b[0m");
var path = require('path'),
fs = require('fs');
//express part for uploading files from html-form
var multer  = require('multer');
//var S3 = require("../models/amazon.js");
var DB = require("../models");
var upload = multer({ dest: null });

console.log(Object.getOwnPropertyNames(DB));
if(process.argv[2]){
	var D = process.argv[2]
	for(var i =0; i<D; i++){
		DB.sendFoodToDB("BigMac"+D, "12"+D, "", "120"+D, "Charlotte", false, false, "burger", "amazing!");
	}
}

module.exports = function(app){
	app.get("/", function(request, response){
		console.log("index requested");
		response.render("login");
	});
	app.post('/upload', upload.single('file'), function (request, response) {
		console.log("Post Upload Photo request!");
		console.log(!!request.file);
		console.log(typeof(request.file));
		console.log(request.file)
		var image = new Buffer(request.file.buffer);
	});

	app.post("api/add/", function(request, response){
		var food = {
			user: ""
		}
		DB.sendFoodToDB(request.food_name, 
			request.user_id,
			request.photoObjec, 
			request.price, 
			request.location, 
			request.gFree, 
			request.veg, 
			request.type, 
			request.tags);
		response.send("Added!");
	})
}