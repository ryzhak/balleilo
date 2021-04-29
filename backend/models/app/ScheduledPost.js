const moment = require('moment');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	publish_at: {
		type: Number,
		required: true,
	},
	published_at: {
		type: Number,
		default: null,
	},
	data: {},
	unique_hash: {
		type: String,
		required: true,
	},
	created_at: {
		type: Number,
		required: true,
		default: moment().unix()
	},
	channel_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	template_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
}, {
	collection: 'app_scheduled_post'
});

const ScheduledPost = mongoose.model('ScheduledPost', modelSchema);

module.exports = ScheduledPost;
