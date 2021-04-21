const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	update: {
		type: String,
		default: null
	},
	bookmakers: [{
		external_id: {
			type: Number,
			default: null
		},
		name: {
			type: String,
			default: null
		},
		bets: [{
			external_id: {
				type: Number,
				default: null
			},
			name: {
				type: String,
				default: null
			},
			values: [{
				value: {
					type: String,
					default: null
				},
				odd: {
					type: String,
					default: null
				},
			}],
		}],
	}],
	fixture_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
}, {
	collection: 'api_football_fixture_odds'
});

const FixtureOdds = mongoose.model('FixtureOdds', modelSchema);

module.exports = FixtureOdds;
