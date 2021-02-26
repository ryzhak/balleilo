const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	rss_url: {
		type: String,
		required: true
	},
	language_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
});

const NewsSource = mongoose.model('NewsSource', modelSchema);

module.exports = NewsSource;
