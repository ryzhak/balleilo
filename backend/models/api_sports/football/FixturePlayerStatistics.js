const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	statistics: [{
		games: {
			minutes: {
				type: Number,
				default: null
			},
			number: {
				type: Number,
				default: null
			},
			position: {
				type: String,
				default: null
			},
			rating: {
				type: String,
				default: null
			},
			captain: {
				type: Boolean,
				default: false
			},
			substitute: {
				type: Boolean,
				default: false
			},
		},
		offsides: {
			type: Number,
			default: null
		},
		shots: {
			total: {
				type: Number,
				default: null
			},
			on: {
				type: Number,
				default: null
			},
		},
		goals: {
			total: {
				type: Number,
				default: null
			},
			conceded: {
				type: Number,
				default: null
			},
			assists: {
				type: Number,
				default: null
			},
			saves: {
				type: Number,
				default: null
			},
		},
		passes: {
			total: {
				type: Number,
				default: null
			},
			key: {
				type: Number,
				default: null
			},
			accuracy: {
				type: String,
				default: null
			},
		},
		tackles: {
			total: {
				type: Number,
				default: null
			},
			blocks: {
				type: Number,
				default: null
			},
			interceptions: {
				type: Number,
				default: null
			},
		},
		duels: {
			total: {
				type: Number,
				default: null
			},
			won: {
				type: Number,
				default: null
			},
		},
		dribbles: {
			attempts: {
				type: Number,
				default: null
			},
			success: {
				type: Number,
				default: null
			},
			past: {
				type: Number,
				default: null
			},
		},
		fouls: {
			drawn: {
				type: Number,
				default: null
			},
			committed: {
				type: Number,
				default: null
			},
		},
		cards: {
			yellow: {
				type: Number,
				default: null
			},
			red: {
				type: Number,
				default: null
			},
		},
		penalty: {
			won: {
				type: Number,
				default: null
			},
			commited: {
				type: Number,
				default: null
			},
			scored: {
				type: Number,
				default: null
			},
			missed: {
				type: Number,
				default: null
			},
			saved: {
				type: Number,
				default: null
			},
		},
	}],
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
		required: true
	},
}, {
	collection: 'api_football_fixture_player_statistics'
});

const FixturePlayerStatistics = mongoose.model('FixturePlayerStatistics', modelSchema);

module.exports = FixturePlayerStatistics;
