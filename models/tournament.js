//DEPENDENCIES
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//SCHEMA
var schema = new Schema({
	name: String,
	running: Boolean,
	players: [ { type: Schema.ObjectId } ],
	groups: [ { groupname: String, players: [{type: Schema.ObjectId}] } ],
	brackets: { type: { type: String, enum: ["R16", "Q", "S", "F"] },
		81: String, 82: String, 83: String, 84: String, 85: String, 86: String, 87: String, 88: String,
		89: String, 810: String, 811: String, 812: String, 813: String, 814: String, 815: String, 816: String,
		q1: String, q2: String, q3: String, q4: String, q5: String, q6: String, q7: String, q8: String,
		s1: String, s2: String, s3: String, s4: String,
		f1: String, f2: String },
	brackets_b: { type: { type: String, enum: ["R16", "Q", "S", "F"] },
		81: String, 82: String, 83: String, 84: String, 85: String, 86: String, 87: String, 88: String,
		89: String, 810: String, 811: String, 812: String, 813: String, 814: String, 815: String, 816: String,
		q1: String, q2: String, q3: String, q4: String, q5: String, q6: String, q7: String, q8: String,
		s1: String, s2: String, s3: String, s4: String,
		f1: String, f2: String },
	matches: []
});

//EXPORTS
module.exports = mongoose.model('Tournament', schema);
