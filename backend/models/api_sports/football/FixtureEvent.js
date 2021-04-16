const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	time: {
		elapsed: {
			type: Number,
			default: null
		},
		extra: {
			type: Number,
			default: null
		},
	},
	type: {
		type: String,
		default: null
	},
	detail: {
		type: String,
		default: null
	},
	comments: {
		type: String,
		default: null
	},
	fixture_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	team_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	player_id: {
		type: mongoose.Schema.Types.ObjectId,
		default: null,
	},
	assist_player_id: {
		type: mongoose.Schema.Types.ObjectId,
		default: null
	},
}, {
	collection: 'api_football_fixture_event'
});

const FixtureEvent = mongoose.model('FixtureEvent', modelSchema);

module.exports = FixtureEvent;
