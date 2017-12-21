'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(__filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};
var S3 = require("./amazon2.js");

if (config.use_env_variable) {
	var sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
	var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

console.log("SQL model: \x1b[32mok!\x1b[0m");

const Users = sequelize.define('users', {
	user_id: {
		type:Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	login: Sequelize.STRING,
	alias: Sequelize.STRING,
	password: Sequelize.STRING,
	location: Sequelize.STRING,
	preferences: Sequelize.STRING,
});
const Food = sequelize.define('food', {
	food_id: Sequelize.INTEGER,
	food_name: Sequelize.STRING,
	photoUrl: Sequelize.STRING,
	price: Sequelize.INTEGER,
	gluFree: Sequelize.BOOLEAN,
	type: Sequelize.STRING,
	veg: Sequelize.BOOLEAN
});
const Locations = sequelize.define('locations', {
	location_id: Sequelize.INTEGER,
	location_name: Sequelize.STRING,
	gps_tag: Sequelize.STRING,
});

sequelize.sync()
.then(() => {Users.create({
	login: "vvitali",
	alias: "Vorobyev",
	password: "test_password",
	location: "34.342, 42.23423",
	preferences: "no",
})
}).then(()=>{
	console.log("Synced!");
	if(process.argv[2]){
		var D = process.argv[2]
		var foodTypes = ["burger","salad","pasta","drink"]
		for(var i =0; i<D; i++){
			db.sendFoodToDB("BigMac"+D, 
				"120"+D,
				"photoTemp",
				Math.floor(Math.random() * 100),
				!!Math.floor(Math.random() * 2), !!Math.floor(Math.random() * 2),
				foodTypes[Math.floor(Math.random() * 3)],
				"amazing!");
		}
	}
})

db.sendFoodToDB = function sendPhotoAndGetURL(food_name, 
	user_id, 
	photo_object, 
	price,
	gFree, 
	veg, 
	type, 
	tags){
	Food.create({
		food_id:  "vvitali",
		food_name: food_name,
		photoUrl: "http://lorempixel.com/400/200/",
		price: price,
		gluFree: gFree,
		type: type,
		veg: veg

	}).then(()=>{
		console.log(food_name+"Added!")
	})
	//will return true in case of success

	return 0;
	S3.sendPhotoAndGetURL(photo_object, user_id+"/"+food_name+".jpg", function(url){
		console.log(url);

		response.send("Ok!");
	});
	return "0";
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;
console.log("Sequelize:\x1b[32mok!\x1b[0m");
module.exports = db;
