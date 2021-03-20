/**
 * Syncs football data in the DB
 * Typically this script should be run by CRON every minute
 */

// setup path for env file in order for script to work in production
require('dotenv').config({ path: `${__dirname}/../../.env` });

const apiSports = require('../lib/apiSports/apiSports');
const db = require('../lib/db');

/**
 * Main function
 */
async function run() {
	let dbConn = null;
	try {
		// create DB connection
		dbConn = await db.connect();

		// sync football data
		// TODO: add leagues from DB
		await apiSports.sync('football', {
			leagues: [
				{ league_id: 235, season: 2020 }, // Russia Premier League
				{ league_id: 39, season: 2020 } // England Premier League
			]
		});
	} catch (err) {
		console.log('===ERROR===');
		console.log(err);
	} finally {
		dbConn.close();
	}
}

// run main function
run();
