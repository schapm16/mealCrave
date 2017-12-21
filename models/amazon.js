// import entire SDK
var AWS = require('aws-sdk');
var fs = require('fs');
//aws credentials
AWS.config.loadFromPath('./config/amazon-config.json');

var BucketName = 'mealcrave-2017';
var s3 = new AWS.S3({
	params: {Bucket: BucketName}
});
//list of buckets
//s3.listBuckets(function(err, data) { console.log(err, data); });
console.log("AWS S3: ok!");
exports.sendPhotoAndGetURL = function sendPhotoAndGetURL(pathToPhoto, nameOfPhoto, cb){
	var image = fs.createReadStream(pathToPhoto);
	var params = {
		Body: image,
		Key: nameOfPhoto,
	};
	s3.putObject(params, function(err, data) {
		if (err){
			console.log(err, err.stack); // an error occurred	
		}else{
			var urlParams = {Bucket: BucketName, Key: nameOfPhoto};
			s3.getSignedUrl('getObject', urlParams, function(err, url){
				cb(url)
				return url;
			})
			
		}
	});
	
}