//DEPENDENCIES
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//SCHEMA
var schema = new Schema({ 
	name: String, 
	phone: String,
	email: String,
	points: Number
});

//EXPORTS
module.exports = mongoose.model('Player', schema);