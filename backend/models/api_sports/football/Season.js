const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	value: {
		type: Number,
		required: true
	},
}, {
	collection: 'api_football_season'
});

const Season = mongoose.model('Season', modelSchema);

module.exports = Season;
