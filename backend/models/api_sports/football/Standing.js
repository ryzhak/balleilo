const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	values: [
		{
			rank: {
				type: Number,
				required: true
			},
			points: {
				type: Number,
				required: true
			},
			goalsDiff: {
				type: Number,
				required: true
			},
			group: {
				type: String,
				required: true
			},
			form: {
				type: String,
				required: true
			},
			status: {
				type: String,
				required: true
			},
			description: {
				type: String,
				required: true
			},
			update: {
				type: String,
				required: true
			},
			all: {
				played: {
					type: Number,
					required: true
				},
				win: {
					type: Number,
					required: true
				},
				draw: {
					type: Number,
					required: true
				},
				lose: {
					type: Number,
					required: true
				},
				goals: {
					for: {
						type: Number,
						required: true
					},
					against: {
						type: Number,
						required: true
					},
				}
			},
			home: {
				played: {
					type: Number,
					required: true
				},
				win: {
					type: Number,
					required: true
				},
				draw: {
					type: Number,
					required: true
				},
				lose: {
					type: Number,
					required: true
				},
				goals: {
					for: {
						type: Number,
						required: true
					},
					against: {
						type: Number,
						required: true
					},
				}
			},
			away: {
				played: {
					type: Number,
					required: true
				},
				win: {
					type: Number,
					required: true
				},
				draw: {
					type: Number,
					required: true
				},
				lose: {
					type: Number,
					required: true
				},
				goals: {
					for: {
						type: Number,
						required: true
					},
					against: {
						type: Number,
						required: true
					},
				}
			},
			team_id: {
				type: mongoose.Schema.Types.ObjectId,
				required: true
			},
		}
	],
	league_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	season_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
}, {
	collection: 'api_football_standing'
});

const Standing = mongoose.model('Standing', modelSchema);

module.exports = Standing;
