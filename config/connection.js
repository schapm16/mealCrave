var Sequelize = require("sequelize");
var config = require("./config.js");
// Creates mySQL connection using Sequelize
var status = "development";
, 
var sequelize = new Sequelize(config[status].database, config[status].username, config[status].password, {
	host: "localhost",
	dialect: "mysql",
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	}
});

module.exports = sequelize;
