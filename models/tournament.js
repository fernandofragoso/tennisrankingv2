//DEPENDENCIES
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//SCHEMA
var schema = new Schema({ 
	name: String,
	running: Boolean,
	players: [ { type: Schema.ObjectId } ],
	matches: []
});

//EXPORTS
module.exports = mongoose.model('Tournament', schema);