const moment = require('moment');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	name: {
		type: String,
		required: true
	},
}, {
	collection: 'app_social_media_platform'
});

const SocialMediaPlatform = mongoose.model('SocialMediaPlatform', modelSchema);

module.exports = SocialMediaPlatform;
