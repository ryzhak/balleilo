const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	external_id: {
		type: Number,
		required: true
	},
	referee: {
		type: String,
		default: null
	},
	start_at: {
		type: Number,
		required: true
	},
	periods: {
		first: {
			type: Number,
			default: null
		},
		second: {
			type: Number,
			default: null
		},
	},
	venue: {
		external_id: {
			type: Number,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		city: {
			type: String,
			required: true
		},
	},
	status: {
		long: {
			type: String,
			required: true
		},
		short: {
			type: String,
			required: true
		},
		elapsed: {
			type: Number,
			default: null
		},
	},
	goals: {
		home: {
			type: Number,
			default: null
		},
		away: {
			type: Number,
			default: null
		},
	},
	score: {
		halftime: {
			home: {
				type: Number,
				default: null
			},
			away: {
				type: Number,
				default: null
			},
		},
		fulltime: {
			home: {
				type: Number,
				default: null
			},
			away: {
				type: Number,
				default: null
			},
		},
		extratime: {
			home: {
				type: Number,
				default: null
			},
			away: {
				type: Number,
				default: null
			},
		},
		penalty: {
			home: {
				type: Number,
				default: null
			},
			away: {
				type: Number,
				default: null
			},
		}
	},
	league_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	season_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	round_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	home_team_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	away_team_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
}, {
	collection: 'api_football_fixture'
});

const Fixture = mongoose.model('Fixture', modelSchema);

module.exports = Fixture;
