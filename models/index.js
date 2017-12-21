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
  preferences: Sequelize.STRING,
});
const Locations = sequelize.define('locations', {
  location_id: Sequelize.INTEGER,
  location_name: Sequelize.STRING,
  gps_tag: Sequelize.STRING,
});

sequelize.sync()
  .then(() => Users.create({
    login: "vvitali",
    alias: "Vorobyev",
    password: "test_password",
    location: "34.342, 42.23423",
    preferences: "no",
  })).then(() => {
    console.log("Synced!")
  })


db.sendFoodToDB = function sendPhotoAndGetURL(food_name, user_id, photo_object, price, location, gFree, veg, type, tags) {
  //will return true in case of success
  return "0";
}


db.sequelize = sequelize;
db.Sequelize = Sequelize;
console.log("Sequelize:\x1b[32mok!\x1b[0m");
module.exports = db;
