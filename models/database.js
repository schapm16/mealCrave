module.exports = function(){
	var objectToExport = {
		name: "sql"
	};
	console.log("SQL additional model: \x1b[32mok!\x1b[0m");

	var S3 = require("./amazon2.js");

	objectToExport.sendFoodToDB= function sendPhotoAndGetURL(food_name, user_id, photo_object, price, location, gFree, veg, type, tags){
		

		return something;
	}


	//final return to scope
	return objectToExport;
}