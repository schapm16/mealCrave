console.log("Controllers: Ok!");
var path = require('path'),
fs = require('fs');
//express part for uploading files from html-form
var multer  = require('multer');
var upload = multer({ dest: null });

module.exports = function(app){

	app.get("/", function(request, response){
		console.log("index requested");
		response.render("login");
	});
	app.post('/upload', upload.single('file'), function (request, response) {
		console.log("Post Upload Photo request!");
		console.log(!!request.file);
		console.log(typeof(request.file));
		console.log(request.file)

		var image = new Buffer(request.file.buffer).toString("base64");

		fs.writeFile("test.txt", image, function(){
			console.log("Done!");
		})

	});

}


