console.log("Api routes: Ok!")
module.exports = function(app){
	
	var controllers = require("../controllers/index.js");


	app.get("/", controllers.login);
}

