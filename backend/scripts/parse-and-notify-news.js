require('dotenv').config();

const Parser = require('rss-parser');
const db = require('../lib/db');
const News = require('../models/News');
const NewsSource = require('../models/NewsSource');

// prepare XML parser
const parser = new Parser({
	customFields: {
		item: [
			// championat.com custom xml tags
			'tags'
		]
	}
});

/**
 * Main function
 */
async function run() {
	// for all news sources
	//   parse news
	//   for all parsed news
	//	   get news model converted from XML
	//     if news item does not exist then save it
	let dbConn = null;
	try {
		// create DB connection
		dbConn = await db.connect();

		// for all news sources
		const newsSources = await NewsSource.find();
		for (let newsSource of newsSources) {
			// get feed
			const feed = await parser.parseURL(newsSource.rss_url);
			// for all feed items
			for (let feedItem of feed.items) {
				// convert feed item to news data
				const newsData = NewsSource.getNewsDataFromXmlItem(newsSource.name, newsSource._id, feedItem);
				// if news model does not exist then save it
				let newsModel = await News.findOne({url: newsData.url});
				if (!newsModel) {
					newsModel = new News(newsData);
					await newsModel.save();
				}
			}
		}
	} catch (err) {
		console.log('===Error===');
		console.log(err);
	} finally {
		dbConn.close();
	}
}

// run main function
run();
