const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	home_team_statistics: [
		{
			type: {
				type: String,
				required: true
			},
			value: {
				type: String,
				default: null
			}
		}
	],
	away_team_statistics: [
		{
			type: {
				type: String,
				required: true
			},
			value: {
				type: String,
				default: null
			}
		}
	],
	fixture_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
}, {
	collection: 'api_football_fixture_statistics'
});

const FixtureStatistics = mongoose.model('FixtureStatistics', modelSchema);

module.exports = FixtureStatistics;
