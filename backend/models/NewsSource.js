const moment = require('moment');
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

/**
 * Converts news item from RSS XML feed to news DB model
 * @param {string} newsSourceName news source name 
 * @param {string} newsSourceId news source mongo id
 * @param {Object} xmlItem item data from RSS XML feed
 * @return {Object} data prepared for news model 
 */
modelSchema.statics.getNewsDataFromXmlItem = (newsSourceName, newsSourceId, xmlItem) => {
	// empty news data model
	let newsData = {
		title: null,
		url: null,
		published_at: null,
		guid: null,
		description: null,
		tags: [],
		source_id: null
	};
	// championat.com
	if (newsSourceName === 'championat.com') {
		newsData.title = xmlItem.title;
		newsData.url = xmlItem.link;
		newsData.published_at = moment(xmlItem.pubDate).unix();
		newsData.guid = xmlItem.guid;
		newsData.description = xmlItem.content;
		newsData.tags = xmlItem.tags ? xmlItem.tags.tag.map(tag => tag._) : [];
		newsData.source_id = newsSourceId
	}
	// soccernews.com
	if (newsSourceName === 'soccernews.com') {
		newsData.title = xmlItem.title;
		newsData.url = xmlItem.link;
		newsData.published_at = moment(xmlItem.pubDate).unix();
		newsData.guid = xmlItem.guid;
		newsData.description = xmlItem.content;
		newsData.tags = xmlItem.categories;
		newsData.source_id = newsSourceId
	}
	return newsData;
};

const NewsSource = mongoose.model('NewsSource', modelSchema);

module.exports = NewsSource;
