const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	external_id: {
		type: Number,
		default: null
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
	team: {
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
	career: [{
		team: {
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
		start: {
			type: String,
			default: null
		},
		end: {
			type: String,
			default: null
		},
	}],
}, {
	collection: 'api_football_coach'
});

const Coach = mongoose.model('Coach', modelSchema);

module.exports = Coach;
