var operations = require("../public/javascript/login.js");

it("should get True from login API", function(){

	var expectedResult = true;
	var result = operations.multiply(3, 5);
	if(result!==expectedResult){
		throw new Error(`Expected ${expectedResult}, but got ${result}`);
	}
});