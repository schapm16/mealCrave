console.log("Controllers: Ok!");
var db = require("../models");

module.exports = function(app) {

	app.get("/", function(request, response) {
		console.log("index requested");
		response.render("login");
	});

	app.get("/api/location/:id", function(req, res) {
		db.Locations.findOne({
			where: {
				locations_id: req.params.id
			}
		}).then(function(location) {
			res.json(location)
		})
	});



};
