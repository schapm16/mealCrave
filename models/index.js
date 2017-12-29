'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(__filename);
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];
var db = {};
var S3 = require("./amazon2.js")(); 
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
Food.belongsTo(Users, {foreignKey: "user_id"});

sequelize.sync()
.then(() => {	
}).then(()=>{
	console.log("Synced!");
	//if argument was passed in command linu at start - create a test-data in database
	if(process.argv[2]){

		Locations.create({
			location_name:"Charlotte, NC",
			gps_tag: "34.333, 35.222"
		});
		Locations.create({
			location_name:"Portland, OR",
			gps_tag: "66.77, 12.192"
		});
		Users.create({
			login: "vvitali",
			alias: "Vorobyev",
			password: "test_password",
			locationId: 1,
			preferences: "no",
		});
		Users.create({
			login: "cstephen",
			alias: "Chapman",
			password: "s_password_test",
			locationId: 2,
			preferences: "no",
		});

		var D = process.argv[2]
		var foodTypes = ["burger","salad","pasta","drink"];
		var len = foodTypes.length-1;
		for(var i =0; i<D; i++){
			db.sendFoodToDB("BigMac"+i, //food name
				Math.floor(Math.random() * 2 + 1), //random user id
				"photoTemp", //random photo url, check definition of the function to change it from leromPixel link to actual data
				Math.floor(Math.random() * 100), //random price
				!!Math.floor(Math.random() * 2), !!Math.floor(Math.random() * 2), //random gluten free, and veg. parameters.
				foodTypes[Math.floor(Math.random() * len)],//random food type from array of foodtypes
				"amazing!", // optional test tag
				Math.floor(Math.random() * 2 + 1)); // random user id
		}
	}
})

db.sendFoodToDB = function(food_name, 
	user_id, 
	photo_object, 
	price,
	location_id,
	gFree, 
	veg, 
	type, 
	tags){
	S3.sendPhotoAndGetURL(photo_object, user_id+"/"+food_name+".jpg", function(url){
		console.log(url);

		Food.create({
			user_id: user_id,
			food_name: food_name,
			photoUrl: url,
			price: price,
			gluFree: gFree,
			type: type,
			veg: veg,
			locationId: location_id
		}).then(()=>{
			console.log(food_name+"  Added!")
		});
	});
}

db.getFoodByType

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Locations = Locations;
db.Food = Food;
db.Users = Users;

console.log("Sequelize:\x1b[32mok!\x1b[0m");
module.exports = db;
