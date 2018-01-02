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
	login: {
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
		type: Sequelize.FLOAT,
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
Food.belongsTo(Users, { foreignKey: "user_id" });

sequelize.sync()
	.then(() => {}).then(() => {
		console.log("Synced!");
		//if argument was passed in command linu at start - create a test-data in database
		if (process.argv[2]) {
			Locations.create({
				location_name: "Charlotte, NC",
				gps_tag: "34.333, 35.222"
			});
			Locations.create({
				location_name: "Portland, OR",
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
			var foodTypes = ["burger", "salad", "pasta", "drink"];
			var locMock = ["Charlotte, NC", "Portland, OR"];
			var len = foodTypes.length - 1;
			for (var i = 0; i < D; i++) {
				db.sendFoodToDB("BigMac" + i, //food name
					Math.floor(Math.random() * 2 + 1), //random user id
					"lorem", //random photo url, check definition of the function to change it from leromPixel link to actual data
					Math.floor(Math.random() * 100), //random price
					locMock[Math.floor(Math.random() * (locMock.length - 1))], //random location ID
					!!Math.floor(Math.random() * 2), !!Math.floor(Math.random() * 2), //random gluten free, and veg. parameters.
					foodTypes[Math.floor(Math.random() * len)], //random food type from array of foodtypes
					"amazing!",
					"placeholder",
					() => {

					}) // optional test tag
			};
		}
	})

db.sendFoodToDB = function(food_name,
	user_id,
	photo_object,
	price,
	location_address,
	gfree,
	veg,
	type,
	tags,
	userName,
	cb) {

	S3.sendPhotoAndGetURL(photo_object, user_id + "/" + food_name + ".jpg", function(url) {
		//trying to find a location in database

		var locationName = location_address.split(",");
		console.log(locationName)
		Locations.findOrCreate({ where: { gps_tag: location_address }, defaults: { location_name: locationName[0] } }).spread((locationF, created) => {
			var gluten;
			var vegi;
			console.log("inner test, created: " + created);

			console.log(locationF.id);
			if (photo_object == "lorem") {
				console.log("lorem!");
				url = "http://lorempixel.com/400/200/food/";
			}
			if (gfree == "true") {
				gluten = 1
			}
			if (gfree == null) {
				gluten = 0
			}
			if (veg == "true") {
				vegi = 1
			}
			if (veg == null) {
				vegi = 0
			}
			Food.create({
				user_id: user_id,
				food_name: food_name,
				photoUrl: url,
				price: price,
				gluFree: gluten,
				type: "standart",
				veg: vegi,
				locationId: locationF.id
			}).then(() => {
				console.log(food_name + "  Added!");
				cb(userName);
			});
		});
	});
};

db.editFoodInDB = function(food_id,
	location_id,
	price,
	food_name,
	veg,
	gFree,
	photo_object, userName, cb) {
	console.log(userName);
	var gluten;
	var vegi;
	if (photo_object) {
		S3.sendPhotoAndGetURL(photo_object, "pictures/" + food_name + ".jpg", function(url) {
			console.log("New photo: " + url);

			Food.update({
				photoUrl: url
			}, {
				where: {
					food_id: food_id
				}
			}).then(() => {
				console.log(food_name + "  Updated photo!");
			});
		});
	}
	if (location_id) {
		Food.update({
			locationId: location_id
		}, {
			where: {
				food_id: food_id
			}
		}).then(() => {
			console.log(food_name + "  Updated location!");
		});
	}
	if (price) {
		Food.update({
			price: price
		}, {
			where: {
				food_id: food_id
			}
		}).then(() => {
			console.log(food_name + "  Updated price!");
		});
	}
	if (food_name) {
		Food.update({
			food_name: food_name
		}, {
			where: {
				food_id: food_id
			}
		}).then(() => {
			console.log(food_name + "  Updated food name!");
		});
	}
	if (gFree == "true") {
		gluten = 1
	}
	if (gFree == null) {
		gluten = 0
	}
	if (veg == "true") {
		vegi = 1
	}
	if (veg == null) {
		vegi = 0
	}
	if (veg == "true" || veg == null) {
		Food.update({
			veg: vegi
		}, {
			where: {
				food_id: food_id
			}
		}).then(() => {
			console.log(food_name + "  Updated veg!");
		});
	}
	if (gFree == "true" || gFree == null) {
		Food.update({
			gluFree: gluten
		}, {
			where: {
				food_id: food_id
			}
		}).then(() => {
			console.log(food_name + "  Updated gluten!");
		});
	}
	cb(userName);
};

db.deleteFood = function(food_id, cb) {
	Food.destroy({
		where: {
			food_id: food_id
		}
	}).then(() => {
		cb()
		console.log(food_id + "  Deleted!");
	});
};

db.getFoodByType;

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Locations = Locations;
db.Food = Food;
db.Users = Users;

console.log("Sequelize:\x1b[32mok!\x1b[0m");
module.exports = db;
