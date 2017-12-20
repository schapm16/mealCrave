console.log("Controllers: Ok!");
exports.login = (request, response)=>{
	console.log("login page requested");
	response.render("login");
}