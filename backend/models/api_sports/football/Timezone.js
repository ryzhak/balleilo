const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	name: {
		type: String,
		required: true
	},
}, {
	collection: 'api_football_timezone'
});

const Timezone = mongoose.model('Timezone', modelSchema);

module.exports = Timezone;
