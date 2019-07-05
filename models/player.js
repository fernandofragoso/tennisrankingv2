//DEPENDENCIES
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//SCHEMA
var schema = new Schema({ 
	name: String, 
	phone: String,
	email: String,
	points: Number,
	matches: [],
	disabled: Boolean
});

//EXPORTS
module.exports = mongoose.model('Player', schema);