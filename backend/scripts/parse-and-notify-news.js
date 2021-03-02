require('dotenv').config();

const moment = require('moment');
const TelegramBot = require('node-telegram-bot-api');
const Parser = require('rss-parser');
const db = require('../lib/db');
const News = require('../models/News');
const NewsSource = require('../models/NewsSource');

// prepare telegram bot for posting news
const telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_API_TOKEN);

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

		// post freshly parsed news to telegram channel
		const newsToPublishItems = await News.find({created_at: {$gte: scriptStartedAt}});
		// NOTICE: telegram bot can not send more than 20 messages per minute in the same group(channel) due to API rate limit
		for (let i = 0; i < newsToPublishItems.length; i++) {
			// publish news item to telegram channel
			await telegramBot.sendMessage('@fckrd1', `${newsToPublishItems[i].title}\n\n${newsToPublishItems[i].description}\n\n${newsToPublishItems[i].url}`);
			// wait for 1 minute every 15 news items
			if ((i + 1) % 15 == 0) await new Promise(resolve => setTimeout(resolve, 60 * 1000));
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
