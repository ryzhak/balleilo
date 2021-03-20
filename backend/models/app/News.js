const moment = require('moment');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: true
	},
	published_at: {
		type: Number,
		required: true
	},
	guid: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	tags: {
		type: [],
		default: []
	},
	created_at: {
		type: Number,
		required: true,
		default: moment().unix()
	},
	source_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
}, {
	collection: 'app_news'
});

const News = mongoose.model('News', modelSchema);

module.exports = News;
