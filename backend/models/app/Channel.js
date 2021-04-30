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
	collection: 'app_channel',
	toJSON: { 
		virtuals: true 
	},
});

modelSchema.virtual('teams', {
	ref: 'Team',
	localField: 'team_ids',
	foreignField: '_id',
	justOne: false,
});

modelSchema.virtual('templates', {
	ref: 'Template',
	localField: 'template_ids',
	foreignField: '_id',
	justOne: false,
});

modelSchema.virtual('social_media_platform', {
	ref: 'SocialMediaPlatform',
	localField: 'social_media_platform_id',
	foreignField: '_id',
	justOne: true,
});

modelSchema.virtual('sport', {
	ref: 'Sport',
	localField: 'sport_id',
	foreignField: '_id',
	justOne: true,
});

modelSchema.virtual('language', {
	ref: 'Language',
	localField: 'language_id',
	foreignField: '_id',
	justOne: true,
});

const Channel = mongoose.model('Channel', modelSchema);

module.exports = Channel;
