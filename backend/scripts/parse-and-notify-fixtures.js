// setup path for env file in order for script to work in production
require('dotenv').config({ path: `${__dirname}/../../.env` });

const TelegramBot = require('node-telegram-bot-api');

const apiFootball = require('../lib/apiFootball');
const db = require('../lib/db');
const Fixture = require('../models/Fixture');

// prepare telegram bot for posting
const telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_API_TOKEN);

/**
 * Main function
 */
async function run() {
	let dbConn = null;
	try {
		// create DB connection
		dbConn = await db.connect();

		// available leagues for parsing
		const leagues = [
			{ season: 2020, id: 235 }, // Russia Premier League
			{ season: 2020, id: 39 } // England Premier League
		];

		// for all leagues that should be parsed
		for (let league of leagues) {
			// get all fixtures in a league
			const fixturesResp = await apiFootball.getFixtures(league.id, league.season);
			// for all fixtures in a league
			for (let fixtureRaw of fixturesResp.data.response) {
				// try to find fixture in the DB
				let mFixture = await Fixture.findOne({external_id: fixtureRaw.fixture.id});
				if (!mFixture) {
					// fixture does not exist, create a new one
					mFixture = new Fixture({
						external_id: fixtureRaw.fixture.id,
						start_at: fixtureRaw.fixture.timestamp,
						status: fixtureRaw.fixture.status.short,
						home_team_name: fixtureRaw.teams.home.name,
						away_team_name: fixtureRaw.teams.away.name,
						goals_home: fixtureRaw.goals.home,
						goals_away: fixtureRaw.goals.away
					});
					await mFixture.save();
				} else {
					// fixture exists
					// if fixture status was changed to "FT" then post a message to telegram channel
					if (mFixture.status !== 'FT' && fixtureRaw.fixture.status.short === 'FT') {
						const message = `Match result\n\n${fixtureRaw.teams.home.name} ${fixtureRaw.goals.home}:${fixtureRaw.goals.away} ${fixtureRaw.teams.away.name}`;
						await telegramBot.sendMessage('@fckrd1', message);
					}
					// update fixture fields that could be changed
					mFixture.start_at = fixtureRaw.fixture.timestamp;
					mFixture.status = fixtureRaw.fixture.status.short;
					mFixture.goals_home = fixtureRaw.goals.home;
					mFixture.goals_away = fixtureRaw.goals.away;
					await mFixture.save();
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
