const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	external_id: {
		type: Number,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	founded: {
		type: Number,
		default: null
	},
	national: {
		type: Boolean,
		required: true
	},
	logo: {
		type: String,
		required: true
	},
	country_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	venue_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
}, {
	collection: 'api_football_team'
});

const Team = mongoose.model('Team', modelSchema);

module.exports = Team;
