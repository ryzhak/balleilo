const moment = require('moment');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	external_id: {
		type: String,
		required: true
	},
	team_ids: [],
	news_tags: [],
	template_ids: [],
	created_at: {
		type: Number,
		required: true,
		default: moment().unix()
	},
	social_media_platform_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	sport_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	language_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
}, {
	collection: 'app_channel'
});

const Channel = mongoose.model('Channel', modelSchema);

module.exports = Channel;
