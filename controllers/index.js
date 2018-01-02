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
	app.get("/addFood", function(request, response) {
		console.log("index requested");
		response.render("addFood");
	});
	//add only food element to the database
	app.post("/api/addFood", upload.single('photo'), function(request, response) {
		//request.file - this variable will contain file from "photo" key
		var food = {
			user: ""
		}
		DEBUG && console.log(request.file.originalname);
		DEBUG && console.log(request.body.location)
		DB.Users.findOne({ where: { login: request.body.userName } }).then(userObject => {
			console.log("UserID:" + userObject.user_id);
			DB.sendFoodToDB(request.body.menuName, //+
				userObject.user_id, //+
				request.file,
				request.body.price, //+
				request.body.location, //+
				request.body.gfree, //+
				request.body.veg, //+
				request.body.type,
				request.body.tags,
				request.body.userName,
				function(userName) {
					response.redirect('/search/byUserId/' + request.body.userName);
				});

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
		}).then(function(data) {
			DEBUG || console.log("Poutput:" + data);

			//var JSON = data.stringify();
			res.render("searchResults", { data: data, stylePath: "/assets/css/searchResults.css" });

		});
	});
	//this function will find every row in Food table, which contains "keyword" from request in food_name column
	//and will send a JSON back
	app.get("/search/byKeyword/:keyword", function(request, response) {
		DB.Food.findAll({
			include: DB.Locations,
			where: {
				food_name: {
					$like: '%' + request.params.keyword + '%' //it will find every item with "keyword" in the food_name column, no matter what position
				}
			}
		}).then(function(data) {
			DEBUG && console.log(data);
			console.log("DATA: " + data);
			response.render("searchResults", {
				stylePath: '"/assets/css/searchResults.css"',
				data: data
			});
		});
	});
	//this function will find every row in Food table from certain user, it uses user_id for searching

	app.get("/search/byUserId/:userId", function(request, response) {
		DB.Users.findOne({ where: { login: request.params.userId } }).then(userObject => {
			console.log("UserID:" + userObject.user_id);
			DB.Food.findAll({
				include: DB.Locations,
				where: {
					user_id: userObject.user_id
				}
			}).then(function(data) {
				DEBUG && console.log(data);
				//data will contain an array of food objects, each object contains has same keys as columns inside food-table in mysql-db
				response.render("profile", {
					stylePath: '"/assets/css/profile.css"',
					usersFood: data
				});
			});
		});

	});

	app.post("/join", function(req, res) {
		DB.Users.findOne({
			where: {
				//res = {userName: ___ ,
				//password: ____}
				login: req.body.userName
			}
		}).then(function(data) {
			DEBUG && console.log("Join: response: " + !data);
			if (!data) {
				DB.Users.create({
					login: req.body.userName,
					password: req.body.password
				}).then(function() {
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
				login: req.body.userName
			}
		}).then(function(data) {
			console.log(data)
			if (data == null) {
				DEBUG && console.log("\x1b[31m" + req.body.login + ": Access denied!" + "\x1b[0m");
				res.json({ valid: false })
			}
			else if (data.login == req.body.userName) {

				if (data.password == req.body.password) {
					DEBUG && console.log("\x1b[32m" + req.body.login + ": Access granted!" + "\x1b[0m");
					res.json({ valid: true })
				}
				else {
					DEBUG && console.log("\x1b[31m" + req.body.login + ": Access denied!" + "\x1b[0m");
					res.json({ valid: false })
				}
			}

		})
	});
	app.post("/api/updateFood", upload.single('photo'), function(req, res) {
		console.log(req.body.userName);
		console.log(req.body.veg)
		DB.editFoodInDB(req.body.foodId,
			req.body.location,
			req.body.price,
			req.body.menuName,
			req.body.veg,
			req.body.gfree,
			req.file,
			req.body.userName,
			function(userName, foodId) {
				console.log("foodID = " + foodId)
				console.log("tesetset");
				console.log(userName);
				res.redirect("/search/byUserId/" + userName);
			});
	});

	app.post("/api/deleteFood", function(req, res) {
		DB.deleteFood(req.body.foodId, function() {
			res.redirect("/search/byUserId/" + req.body.userName)
		})
	})
	app.get("/map/:restaurantAddress", function(req, res) {
		res.render("map", { restaurantAddress: req.params.restaurantAddress, stylePath: '"/assets/css/map.css"' });
	});
}
