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
	type: {
		type: String,
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
	seasons: [{
		year: {
			type: Number,
			required: true
		},
		start: {
			type: String,
			required: true
		},
		end: {
			type: String,
			required: true
		},
		current: {
			type: Boolean,
			required: true
		},
		coverage: {
			fixtures: {
				events: {
					type: Boolean,
					required: true
				},
				lineups: {
					type: Boolean,
					required: true
				},
				statistics_fixtures: {
					type: Boolean,
					required: true
				},
				statistics_players: {
					type: Boolean,
					required: true
				},
			},
			standings: {
				type: Boolean,
				required: true
			},
			players: {
				type: Boolean,
				required: true
			},
			top_scorers: {
				type: Boolean,
				required: true
			},
			predictions: {
				type: Boolean,
				required: true
			},
			odds: {
				type: Boolean,
				required: true
			},
		}
	}]
}, {
	collection: 'api_football_league'
});

const League = mongoose.model('League', modelSchema);

module.exports = League;
