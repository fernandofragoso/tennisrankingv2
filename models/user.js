//DEPENDENCIES
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//SCHEMA
var schema = new Schema({ 
	login: String,
	password: String,
	type: { type: String, enum: ["adm", "common"] }
});

//EXPORTS
module.exports = mongoose.model('User', schema);