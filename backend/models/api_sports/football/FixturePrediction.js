const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	winner: {
		external_id: {
			type: Number,
			default: null
		},
		name: {
			type: String,
			default: null
		},
		comment: {
			type: String,
			default: null
		},
	},
	win_or_draw: {
		type: Boolean,
		default: false
	},
	under_over: {
		type: String,
		default: null
	},
	goals: {
		home: {
			type: String,
			default: null
		},
		away: {
			type: String,
			default: null
		},
	},
	advice: {
		type: String,
		default: null
	},
	percent: {
		home: {
			type: String,
			default: null
		},
		draw: {
			type: String,
			default: null
		},
		away: {
			type: String,
			default: null
		},
	},
	comparison: {
		form: {
			home: {
				type: String,
				default: null
			},
			away: {
				type: String,
				default: null
			}
		},
		att: {
			home: {
				type: String,
				default: null
			},
			away: {
				type: String,
				default: null
			}
		},
		def: {
			home: {
				type: String,
				default: null
			},
			away: {
				type: String,
				default: null
			}
		},
		poisson_distribution: {
			home: {
				type: String,
				default: null
			},
			away: {
				type: String,
				default: null
			}
		},
		h2h: {
			home: {
				type: String,
				default: null
			},
			away: {
				type: String,
				default: null
			}
		},
		goals: {
			home: {
				type: String,
				default: null
			},
			away: {
				type: String,
				default: null
			}
		},
		total: {
			home: {
				type: String,
				default: null
			},
			away: {
				type: String,
				default: null
			}
		},
	},
	fixture_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
}, {
	collection: 'api_football_fixture_prediction'
});

const FixturePrediction = mongoose.model('FixturePrediction', modelSchema);

module.exports = FixturePrediction;
