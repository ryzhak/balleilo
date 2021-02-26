require('dotenv').config();

const db = require('../lib/db');
const NewsSource = require('../models/NewsSource');

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
			// TODO: get feed
			console.log(newsSource);
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
