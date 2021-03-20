const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	short_name: {
		type: String,
		required: true
	},
	full_name: {
		type: String,
		required: true
	}
}, {
	collection: 'app_language'
});

const Language = mongoose.model('Language', modelSchema);

module.exports = Language;
