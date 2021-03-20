const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	code: {
		type: String,
		default: null
	},
	flag: {
		type: String,
		default: null
	},
}, {
	collection: 'api_football_country'
});

const Country = mongoose.model('Country', modelSchema);

module.exports = Country;
