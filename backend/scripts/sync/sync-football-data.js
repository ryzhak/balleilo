/**
 * Syncs football data in the DB
 * Typically this script should be run by CRON every minute
 */

// setup path for env file in order for script to work in production
require('dotenv').config({ path: `${__dirname}/../../../.env` });

const apiSports = require('../../lib/apiSports/apiSports');
const db = require('../../lib/db');
const Parser = require('../../models/app/Parser');

/**
 * Main function
 */
async function run() {
	let dbConn = null;
	try {
		// create DB connection
		dbConn = await db.connect();

		// prepare leagues param for all parser settings (with football API league id and season)
		let params = {
			leagues: []
		};
		const mParsers = await Parser.find();
		for (let mParser of mParsers) {
			params.leagues.push({
				league_id: mParser.league,
				season: mParser.season
			});
		}

		// sync football data
		await apiSports.sync('football', params);
		
	} catch (err) {
		console.log('===ERROR===');
		console.log(err);
	} finally {
		dbConn.close();
	}
}

// run main function
run();
