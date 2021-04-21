const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	player: {
		external_id: {
			type: Number,
			default: null
		},
		name: {
			type: String,
			default: null
		},
	},
	update: {
		type: String,
		default: null
	},
	transfers: [{
		date: {
			type: String,
			default: null
		},
		type: {
			type: String,
			default: null
		},
		teams: {
			in: {
				external_id: {
					type: Number,
					default: null
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
			out: {
				external_id: {
					type: Number,
					default: null
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
		},
	}],
	team_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
}, {
	collection: 'api_football_transfer'
});

const Transfer = mongoose.model('Transfer', modelSchema);

module.exports = Transfer;
