const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	formation: {
		type: String,
		default: null
	},
	start_11: [{
		player: {
			external_id: {
				type: Number,
				default: null
			},
			name: {
				type: String,
				default: null
			},
			number: {
				type: Number,
				default: null
			},
			pos: {
				type: String,
				default: null
			},
		}
	}],
	substitutes: [{
		player: {
			external_id: {
				type: Number,
				default: null
			},
			name: {
				type: String,
				default: null
			},
			number: {
				type: Number,
				default: null
			},
			pos: {
				type: String,
				default: null
			},
		}
	}],
	coach: {
		external_id: {
			type: Number,
			default: null
		},
		name: {
			type: String,
			default: null
		},
	},
	fixture_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	team_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
}, {
	collection: 'api_football_fixture_lineup'
});

const FixtureLineup = mongoose.model('FixtureLineup', modelSchema);

module.exports = FixtureLineup;
