var db = require("../models");

//locations_id
//location_name
//gps_tag

module.exports = function(app) {
	app.get("/api/location/:id", function(req, res) {
		db.Locations.findOne({
			where: {
				locations_id: req.params.id
			}
		}).then(function(location) {
			res.json(location)
		})
	})
}
