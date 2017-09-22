module.exports = function(obj){
	var newObj = {};
	for(var i in obj){
		newObj[i] = JSON.stringify(obj[i]);
	}
	return newObj;
}