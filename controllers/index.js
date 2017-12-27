var DEBUG = true;
console.log("Controllers: \x1b[32mok!\x1b[0m");
var path = require('path'),
	fs = require('fs');
//express part for uploading files from html-form
var multer = require('multer');
//var S3 = require("../models/amazon.js");
var DB = require("../models");
var upload = multer({ dest: null });

console.log(Object.getOwnPropertyNames(DB));

module.exports = function(app) {
	app.get("/", function(request, response) {
		console.log("index requested");
		response.render("login", { stylePath: '"./assets/css/login.css"' });
	});
	app.post('/upload', upload.single('file'), function(request, response) {
		console.log("Post Upload Photo request!");
		console.log(!!request.file);
		console.log(typeof(request.file));
		console.log(request.file)
		var image = new Buffer(request.file.buffer);
	});
	//add only food element to the database
	app.post("api/addFood/", function(request, response) {
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
		console.log(request.file);
		var image = new Buffer(request.file.buffer);
		DB.S3.sendPhotoAndGetURL(image, "testTest.jpg", function(url) {
			console.log(url);
			response.send("Ok!");
		});
	});

	app.get("/api/location/:id", function(req, res) {
		DB.Locations.findOne({
			where: {
				id: req.params.id
			}
		}).then(function(location) {
			res.json(location);
		});
	});

	app.get("/search/:type", function(req, res) {
		DB.Food.findAll({
			where: {
				type: req.params.type
			}
		}).then(function(results) {
			console.log("Output: " + results);
			res.render("searchResults", { data: results, stylePath: '"./assets/css/searchResults.css"' });
		});
	});

	// ************************************************************************
	app.get("/map/:restaurantAddress", function(req, res) {
		res.render("map", { userAddress: "204 Northbend Dr Charlotte NC 28262", restaurantAddress: req.params.restaurantAddress, stylePath: '"./assets/css/map.css"' });
	});
	//USERADDRESS will be the users geolocation (we can wait and get this when loading the maps page if neccessary)
	//RESTAURANTADDRESS will be the address we get from the data loaded in the results page. we need to "include" the restaurant table in the results that are returned so we can access the restarurants address
	//*************************************************************************

	app.get("/join", function(req, res) {
		DB.Users.findOne({
			where: {
				//res = {userName: ___ ,
				//password: ____}
				login: req.body.userName
			}
		}).then(function(data) {
			if (!data) {
				DB.Users.create(req.body).then(function() {
					res.json({ valid: true })
				});
			}
			else {
				res.json({ valid: false })
			}
		})
	});

	app.post("/login", function(req, res) {
		DEBUG && console.log("\x1b[33m" + "Login attempt:\nLogin: " + req.body.login + "\nPassword: " + req.body.password + "\x1b[0m");
		DB.Users.findOne({
			where: {
				login: req.body.login
			}
		}).then(function(data) {

			if (data.password == req.body.password) {
				DEBUG && console.log("\x1b[32m" + req.body.login + ": Access granted!" + "\x1b[0m");
				res.json({ valid: true })
			}
			else {
				DEBUG && console.log("\x1b[31m" + req.body.login + ": Access denied!" + "\x1b[0m");
				res.json({ valid: false })
			}
		})
	});
}
