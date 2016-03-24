//DEPENDENCIES
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//SCHEMA
var schema = new Schema({
	tourn_id: Schema.ObjectId,
	p1_id: Schema.ObjectId,
	p2_id: Schema.ObjectId,
	round: { type: String, enum: ["RR", "R32", "R16", "Q", "S", "F"] },
	bracket_b: Boolean,
	score: {
		set_p1: Number,
		set_p2: Number,
		games: [ { game_p1: Number, game_p2: Number } ],
		wo: Boolean
	}
});

//EXPORTS
module.exports = mongoose.model('Match', schema);
