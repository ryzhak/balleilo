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
	address: {
		type: String,
		required: true
	},
	city: {
		type: String,
		required: true
	},
	capacity: {
		type: Number,
		required: true
	},
	surface: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: true
	},
}, {
	collection: 'api_football_venue'
});

const Venue = mongoose.model('Venue', modelSchema);

module.exports = Venue;
