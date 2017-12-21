var fs = require("fs");

fs.readFile("test.txt", "utf8", function(err, data){
	console.log("Reading is done!");



	fs.writeFile("test.jpg", new Buffer(data, "base64"), function(){
		console.log("Done!");
	})
} )