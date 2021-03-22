const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	league_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	season_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
}, {
	collection: 'api_football_round'
});

const Round = mongoose.model('Round', modelSchema);

module.exports = Round;
