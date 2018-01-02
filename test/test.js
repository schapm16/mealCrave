//var controllers  =require("../server.js"); //connect module for testing
//var request = require('supertest');
var request = require("request");
var assert = require('assert');
var baseURL = "http://localhost:8080/";
process.env.NODE_ENV = 'test'

var models = require("../models/index.js");

describe("API request by ID", function() {

	it("should be responded as json", function(done) {
		request.get(baseURL+"api/location/"+1, function(error, response, body) {
			assert.equal("Charlotte, NC", JSON.parse(response.body).location_name);
			done();
		});
	});

	it("Models should return an object with Food, Users, Location tables", function(done) {
		assert.equal(true, 
			typeof(models.Food) == "function"
			&& typeof(models.Locations) == "function"
			&& typeof(models.Users) == "function");
		done();
	});

	it("Delete function should return True", function(done) {
		assert.equal(true, models.deleteFood("test"));
		done();
	});

});