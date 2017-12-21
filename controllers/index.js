console.log("Controllers: Ok!");
module.exports = function(app){

	app.get("/", function(request, response){
		console.log("index requested");
		response.render("login");
	});

}