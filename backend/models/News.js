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
	source_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	}
}, { 
	timestamps: { 
		createdAt: 'created_at',
		updatedAt: false
	}
});

const News = mongoose.model('News', modelSchema);

module.exports = News;
