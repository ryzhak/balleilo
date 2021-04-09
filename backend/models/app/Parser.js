const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	league: {
		type: Number,
		required: true
	},
	season: {
		type: Number,
		required: true
	},
	desc: {
		type: String,
		required: true
	},
}, {
	collection: 'app_parser'
});

const Parser = mongoose.model('Parser', modelSchema);

module.exports = Parser;
