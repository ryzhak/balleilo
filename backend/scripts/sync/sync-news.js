// setup path for env file in order for script to work in production
require('dotenv').config({ path: `${__dirname}/../../../.env` });

const moment = require('moment');
const Parser = require('rss-parser');
const db = require('../../lib/db');
const News = require('../../models/app/News');
const NewsSource = require('../../models/app/NewsSource');

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
	let dbConn = null;
	try {
		// get script start unix time in order to post freshly parsed news
		const scriptStartedAt = moment().unix();

		// create DB connection
		dbConn = await db.connect();

		// parse news from all news sources
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
