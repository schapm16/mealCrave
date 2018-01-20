module.exports = function() {

	// import entire SDK
	var AWS = require('aws-sdk');
	var fs = require('fs');

	var objectToExport = {
		name: "S3"
	};
	//aws credentials,
	AWS.config.loadFromPath('./config/amazon-config.json');

	var BucketName = 'mealcrave-2017';
	var s3 = new AWS.S3({
		params: { Bucket: BucketName }
	});
	//list of buckets
	//s3.listBuckets(function(err, data) { console.log(err, data); });
	console.log("AWS S3: \x1b[32mok!\x1b[0m");
	objectToExport.sendPhotoAndGetURL = function sendPhotoAndGetURL(image, nameOfPhoto, cb) {
		var params = {
			Body: image.buffer,
			Key: nameOfPhoto,
		};
		s3.putObject(params, function(err, data) {
			if (err) {
				console.log(err, err.stack);
			}
			else {
				//instead of using temporary links, or make a new function for creating a new link every time when we need id
				// we will use direct path to the out backet. So, no access control now ( :( )
				// var urlParams = {
				// 	Bucket: BucketName,
				// 	Key: nameOfPhoto,
				// 	Expires: 604800 //expires in one week
				// };
				// s3.getSignedUrl('getObject', urlParams, function(err, url) {
				// 	cb(url)
				// 	return url;
				// });
				cb("https://s3.amazonaws.com/mealcrave-2017/"+nameOfPhoto);
			}
		});
	};
	return objectToExport;
}