'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(__filename);
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];
var db = {};
var S3 = require("./amazon2.js");

if (config.use_env_variable) {
	var sequelize = new Sequelize(process.env[config.use_env_variable], config);
}
else {
	var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

console.log("SQL model: \x1b[32mok!\x1b[0m");

const Users = sequelize.define('users', {
	user_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	login:  {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false 
	},
	alias: Sequelize.STRING,
	password: {
		type: Sequelize.STRING,
		allowNull: false 
	},
	preferences: Sequelize.STRING,
});
const Food = sequelize.define('food', {
	food_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	food_name: {
		type: Sequelize.STRING,
		allowNull: false 
	},
	photoUrl: {
		type: Sequelize.STRING,
		allowNull: false 
	},
	price: {
		type: Sequelize.INTEGER,
		allowNull: false 
	},
	gluFree: Sequelize.BOOLEAN,
	type: Sequelize.STRING,
	veg: Sequelize.BOOLEAN
});
const Locations = sequelize.define('locations', {
	location_name: {
		type: Sequelize.STRING,
		allowNull: false 
	},
	gps_tag: {
		type: Sequelize.STRING,
		allowNull: false 
	},
});

Food.belongsTo(Locations);
Users.belongsTo(Locations);

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

Locations.create({
	location_name:"Charlotte, NC",
	gps_tag: "34.333, 35.222"
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
		veg: veg,
		locationId: 1

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
db.Locations = Locations;
db.Food = Food;
db.Users = Users;

console.log("Sequelize:\x1b[32mok!\x1b[0m");
module.exports = db;
