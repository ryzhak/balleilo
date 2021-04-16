const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	external_id: {
		type: Number,
		required: true
	},
	name: {
		type: String,
		default: null
	},
	firstname: {
		type: String,
		default: null
	},
	lastname: {
		type: String,
		default: null
	},
	age: {
		type: Number,
		default: null
	},
	birth: {
		date: {
			type: String,
			default: null
		},
		place: {
			type: String,
			default: null
		},
		country: {
			type: String,
			default: null
		},
	},
	nationality: {
		type: String,
		default: null
	},
	height: {
		type: String,
		default: null
	},
	weight: {
		type: String,
		default: null
	},
	injured: {
		type: Boolean,
		default: false
	},
	photo: {
		type: String,
		default: null
	},
	statistics: [{
		team: {
			id: {
				type: Number,
				required: true
			},
			name: {
				type: String,
				default: null
			},
			logo: {
				type: String,
				default: null
			},
		},
		games: {
			appearences: {
				type: Number,
				default: null
			},
			lineups: {
				type: Number,
				default: null
			},
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
		},
		substitutes: {
			in: {
				type: Number,
				default: null
			},
			out: {
				type: Number,
				default: null
			},
			bench: {
				type: Number,
				default: null
			},
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
				type: Number,
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
			yellowred: {
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
		league_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true
		},
	}]
}, {
	collection: 'api_football_player'
});

const Player = mongoose.model('Player', modelSchema);

module.exports = Player;
