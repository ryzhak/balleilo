/**
 * API football sync script.
 */

const axios = require('axios');
const moment = require('moment');

const ApiSportsRequest = require('../../models/api_sports/ApiSportsRequest');
const Country = require('../../models/api_sports/football/Country');
const Fixture = require('../../models/api_sports/football/Fixture');
const FixtureEvent = require('../../models/api_sports/football/FixtureEvent');
const FixtureLineup = require('../../models/api_sports/football/FixtureLineup');
const FixturePlayerStatistics = require('../../models/api_sports/football/FixturePlayerStatistics');
const FixturePrediction = require('../../models/api_sports/football/FixturePrediction');
const FixtureStatistics = require('../../models/api_sports/football/FixtureStatistics');
const League = require('../../models/api_sports/football/League');
const Player = require('../../models/api_sports/football/Player');
const Round = require('../../models/api_sports/football/Round');
const Season = require('../../models/api_sports/football/Season');
const Standing = require('../../models/api_sports/football/Standing');
const Team = require('../../models/api_sports/football/Team');
const TeamStatistics = require('../../models/api_sports/football/TeamStatistics');
const Timezone = require('../../models/api_sports/football/Timezone');
const Venue = require('../../models/api_sports/football/Venue');
const Sport = require('../../models/app/Sport');

// Maximum number of requets per minute.
// Free account: 10 req/min.
// Pro account: 200 req/min.
const MAX_REQUESTS_PER_MINUTE = 10;

axios.defaults.baseURL = 'https://v3.football.api-sports.io';
axios.defaults.headers.common['x-apisports-key'] = process.env.API_SPORTS_KEY;

/**
 * Apply timeout before API call in order not to exceed API rate limit
 */
axios.interceptors.request.use(async (request) => {
	// apply timeout, use 80 instead of 60 to be sure not to exceed rate limit
	const timeoutSeconds = 80 / MAX_REQUESTS_PER_MINUTE;
	await new Promise(resolve => setTimeout(resolve, timeoutSeconds * 1000));
	// log API call
	console.log(request.method, request.url);
	// return request object
    return request;
});

// current sport model
let mSport = null;

// map of API path to delay in seconds
// it means the paths below will be called not more often than the specified delay in seconds
const REQUEST_DELAY_SECONDS = {
	'/timezone': 60 * 60 * 24 * 1, // once a day
	'/countries': 60 * 60 * 24 * 1, // once a day
	'/leagues/seasons': 60 * 60 * 24 * 1, // once a day
	'/leagues': 60 * 60 * 24 * 1, // once a day
	'/teams': 60 * 60 * 24 * 1, // once a day
	'/fixtures/rounds': 60 * 60 * 24 * 1, // once a day
	'/fixtures': 60 * 60 * 1, // once an hour
	'/teams/statistics': 60 * 60 * 24 * 7, // once an week
	'/standings': 60 * 60 * 24 * 1, // once a day
	'/fixtures/headtohead': 60 * 60 * 24 * 7, // once an week
	'/players': 60 * 60 * 24 * 7, // once an week
	'/fixtures/lineups': 60 * 10, // every 10 minutes, started 40 minutes before the fixture start, max 4 times per single fixture
};

/**
 * TODO: handle rate limit error
 * 
 * Success state:
 * {
 *   get: 'fixtures/headtohead',
 *   parameters: { h2h: '66-36', last: '10' },
 *   errors: [],
 *   results: 10,
 *   paging: { current: 1, total: 1 },
 *   response: [
 *     {
 *       fixture: [Object],
 *       league: [Object],
 *       teams: [Object],
 *       goals: [Object],
 *       score: [Object]
 *     }
 *   ]
 * }
 * 
 * Error state:
 * {
 *   get: 'fixtures/headtohead',
 *   parameters: { h2h: '49-60', last: '10' },
 *   errors: {
 *     rateLimit: 'Too many requests. Your rate limit is 10 requests per minute.'
 *   },
 *   results: 0,
 *   paging: { current: 1, total: 1 },
 *   response: []
 * }
 *
 */

//=================
// Main sync method
//=================

/**
 * Syncs DB football data
 * @param {Object} params sync params
 * param ex:
 * {
 *   leagues: [
 *     { league_id: 1, season: 2020 },
 *     { league_id: 2, season: 2020 }
 *   ]
 * }  
 */
async function sync(params) {
	// get current sport model
	mSport = await Sport.findOne({name: 'football'});

	// sync global objects
	// await syncTimezones();
	// await syncCountries();
	// await syncLeaguesSeasons();
	// await syncLeagues();
	// await syncTeamsAndVenues(params.leagues);
	// await syncFixturesRounds(params.leagues);
	// await syncPlayers(params.leagues);

	// sync fixtures(calendar) and return finished fixtures (used to update standings, team stats, players' stats, etc...)
	// const mFixturesFinished = await syncFixtures(params.leagues);

	// sync fixtures lineups which depend on available fixtures
	// await syncFixturesLineups(params.leagues);

	// sync objects which depend on finished fixtures
	// await syncTeamStatistics(params.leagues, mFixturesFinished);
	// await syncStandings(params.leagues, mFixturesFinished);
	// await syncFixturesHeadToHead(params.leagues); // depends on standings
	// await syncFixturesStatistics(mFixturesFinished);
	// await syncFixturesEvents(mFixturesFinished);
	// await syncFixturesPlayersStatistics(mFixturesFinished);
	// await syncFixturesPredictions(params.leagues); // depends on standings

	console.log('===synced===');
}

//====================
// Helper sync methods
//====================

/**
 * Syncs countries
 */
async function syncCountries() {
	// prepare API request url
	let url = '/countries';

	// get latest timezone request
	const mLastApiSportsRequest = await ApiSportsRequest.findOne({ sport_id: mSport._id, url: url }).sort({created_at: 'desc'});

	// if there is not latest API request or it is time to make a request
	if (!mLastApiSportsRequest || (moment().unix() > mLastApiSportsRequest.created_at + REQUEST_DELAY_SECONDS[url])) {
		// get countries
		const countriesResp = await axios.get('/countries');
		// foreach country
		for (let countryRaw of countriesResp.data.response) {
			// if country does not exist then create a new one
			let mCountry = await Country.findOne({name: countryRaw.name});
			if (!mCountry) {
				mCountry = new Country({...countryRaw});
				await mCountry.save();
			}
		}
		// save API request to log
		const mApiSportsRequest = new ApiSportsRequest({ sport_id: mSport._id, url: url });
		await mApiSportsRequest.save();
	}
}

/**
 * Syncs timezones
 */
async function syncTimezones() {
	// prepare API request url
	let url = '/timezone';

	// get latest timezone request
	const mLastApiSportsRequest = await ApiSportsRequest.findOne({ sport_id: mSport._id, url: url }).sort({created_at: 'desc'});

	// if there is not latest API request or it is time to make a request
	if (!mLastApiSportsRequest || (moment().unix() > mLastApiSportsRequest.created_at + REQUEST_DELAY_SECONDS[url])) {
		// get timezones
		const timezonesResp = await axios.get('/timezone');
		// foreach timezone
		for (let timezoneName of timezonesResp.data.response) {
			// if timezone does not exist then create a new one
			let mTimezone = await Timezone.findOne({name: timezoneName});
			if (!mTimezone) {
				mTimezone = new Timezone({name: timezoneName});
				await mTimezone.save();
			}
		}
		// save API request to log
		const mApiSportsRequest = new ApiSportsRequest({ sport_id: mSport._id, url: url });
		await mApiSportsRequest.save();
	}
}

/**
 * Syncs seasons in leagues
 */
async function syncLeaguesSeasons() {
	// prepare API request url
	let url = '/leagues/seasons';

	// get latest timezone request
	const mLastApiSportsRequest = await ApiSportsRequest.findOne({ sport_id: mSport._id, url: url }).sort({created_at: 'desc'});

	// if there is not latest API request or it is time to make a request
	if (!mLastApiSportsRequest || (moment().unix() > mLastApiSportsRequest.created_at + REQUEST_DELAY_SECONDS[url])) {
		// get all available seasons in leagues
		const seasonsResp = await axios.get('/leagues/seasons');
		// foreach seasons
		for (let seasonValue of seasonsResp.data.response) {
			// if season does not exist then create a new one
			let mSeason = await Season.findOne({value: seasonValue});
			if (!mSeason) {
				mSeason = new Season({value: seasonValue});
				await mSeason.save();
			}
		}
		// save API request to log
		const mApiSportsRequest = new ApiSportsRequest({ sport_id: mSport._id, url: url });
		await mApiSportsRequest.save();
	}
}

/**
 * Syncs leagues
 */
 async function syncLeagues() {
	// prepare API request url
	let url = '/leagues';

	// get latest timezone request
	const mLastApiSportsRequest = await ApiSportsRequest.findOne({ sport_id: mSport._id, url: url }).sort({created_at: 'desc'});

	// if there is no latest API request or it is time to make a request
	if (!mLastApiSportsRequest || (moment().unix() > mLastApiSportsRequest.created_at + REQUEST_DELAY_SECONDS[url])) {
		// get all available leagues
		const leaguesResp = await axios.get('/leagues');
		// foreach league
		for (let leagueRaw of leaguesResp.data.response) {
			// if league does not exist then create a new one
			let mLeague = await League.findOne({external_id: leagueRaw.league.id});
			if (!mLeague) {
				// find league's country
				const mCountry = await Country.findOne({name: leagueRaw.country.name});
				// save league
				mLeague = new League({
					external_id: leagueRaw.league.id,
					name: leagueRaw.league.name,
					type: leagueRaw.league.type,
					logo: leagueRaw.league.logo,
					country_id: mCountry._id,
					seasons: leagueRaw.seasons
				});
			} else {
				// update league model with latest data
				mLeague.name = leagueRaw.league.name;
				mLeague.type = leagueRaw.league.type;
				mLeague.logo = leagueRaw.league.logo;
				mLeague.seasons = leagueRaw.seasons;
			}
			// save league
			await mLeague.save();
		}
		// save API request to log
		const mApiSportsRequest = new ApiSportsRequest({ sport_id: mSport._id, url: url });
		await mApiSportsRequest.save();
	}
}

/**
 * Syncs teams and venues
 * @param {Array<Object>} leagues leagues data
 * leagues param ex:
 * [
 *     { league_id: 1, season: 2020 },
 *     { league_id: 2, season: 2020 }
 * ]
 */
async function syncTeamsAndVenues(leagues) {
	// prepare API request url
	let url = '/teams';

	// for all provided leagues
	for (let league of leagues) {
		// prepare url for iterated league
		const urlTargeted = `${url}?league=${league.league_id}&season=${league.season}`;

		// get latest teams request
		const mLastApiSportsRequest = await ApiSportsRequest.findOne({ sport_id: mSport._id, url: urlTargeted }).sort({created_at: 'desc'});

		// if there is no latest API request or it is time to make a request
		if (!mLastApiSportsRequest || (moment().unix() > mLastApiSportsRequest.created_at + REQUEST_DELAY_SECONDS[url])) {
			// get all available teams
			const teamsResp = await axios.get(urlTargeted);
			// foreach team
			for (let teamRaw of teamsResp.data.response) {
				// if venue does not exist then create a new one
				let mVenue = await Venue.findOne({external_id: teamRaw.venue.id});
				if (!mVenue) {
					mVenue = new Venue({external_id: teamRaw.venue.id, ...teamRaw.venue});
				} else {
					// venue exists, update it
					mVenue.name = teamRaw.venue.name;
					mVenue.address = teamRaw.venue.address;
					mVenue.city = teamRaw.venue.city;
					mVenue.capacity = teamRaw.venue.capacity;
					mVenue.surface = teamRaw.venue.surface;
					mVenue.image = teamRaw.venue.image;
				}
				// save venue
				await mVenue.save();

				// find team country
				const mCountry = await Country.findOne({name: teamRaw.team.country});
				// if team does not exist then create a new one
				let mTeam = await Team.findOne({external_id: teamRaw.team.id});
				if (!mTeam) {
					// set team attributes
					mTeam = new Team({
						external_id: teamRaw.team.id,
						country_id: mCountry._id,
						venue_id: mVenue._id,
						...teamRaw.team
					});
				} else {
					// team exists, update it
					mTeam.name = teamRaw.team.name;
					mTeam.founded = teamRaw.team.founded;
					mTeam.national = teamRaw.team.national;
					mTeam.logo = teamRaw.team.logo;
					mTeam.country_id = mCountry._id;
					mTeam.venue_id = mVenue._id;
				}
				// save team
				await mTeam.save();
			}

			// save API request to log
			const mApiSportsRequest = new ApiSportsRequest({ sport_id: mSport._id, url: urlTargeted });
			await mApiSportsRequest.save();
		}
	}
}

/**
 * Syncs league rounds
 * @param {Array<Object>} leagues leagues data
 * leagues param ex:
 * [
 *     { league_id: 1, season: 2020 },
 *     { league_id: 2, season: 2020 }
 * ]
 */
 async function syncFixturesRounds(leagues) {
	// prepare API request url
	let url = '/fixtures/rounds';

	// for all provided leagues
	for (let league of leagues) {
		// prepare url for iterated league
		const urlTargeted = `${url}?league=${league.league_id}&season=${league.season}`;

		// get league and season models
		const mLeague = await League.findOne({external_id: league.league_id});
		const mSeason = await Season.findOne({value: league.season});

		// get latest rounds request
		const mLastApiSportsRequest = await ApiSportsRequest.findOne({ sport_id: mSport._id, url: urlTargeted }).sort({created_at: 'desc'});

		// if there is no latest API request or it is time to make a request
		if (!mLastApiSportsRequest || (moment().unix() > mLastApiSportsRequest.created_at + REQUEST_DELAY_SECONDS[url])) {
			// get all available rounds
			const roundsResp = await axios.get(urlTargeted);
			// foreach round
			for (let roundName of roundsResp.data.response) {
				// if round does not exist then create a new one
				let mRound = await Round.findOne({name: roundName, league_id: mLeague._id, season_id: mSeason._id});
				if (!mRound) {
					mRound = new Round({name: roundName, league_id: mLeague._id, season_id: mSeason._id});
				} else {
					// round exists, update its name
					mRound.name = roundName;
				}
				// save round
				await mRound.save();
			}

			// save API request to log
			const mApiSportsRequest = new ApiSportsRequest({ sport_id: mSport._id, url: urlTargeted });
			await mApiSportsRequest.save();
		}
	}
}

/**
 * Syncs fixtures(calendar)
 * @param {Array<Object>} leagues leagues data
 * leagues param ex:
 * [
 *     { league_id: 1, season: 2020 },
 *     { league_id: 2, season: 2020 }
 * ]
 * @return {Array<Object>} array of finished fixture models
 */
async function syncFixtures(leagues) {
	// prepare API request url
	let url = '/fixtures';

	// prepare result array for finished fixtures
	let finishedFixtures = [];

	// for all provided leagues
	for (let league of leagues) {
		// prepare url for iterated league
		const urlTargeted = `${url}?league=${league.league_id}&season=${league.season}`;

		// get league and season models
		const mLeague = await League.findOne({external_id: league.league_id});
		const mSeason = await Season.findOne({value: league.season});

		// get latest fixtures request
		const mLastApiSportsRequest = await ApiSportsRequest.findOne({ sport_id: mSport._id, url: urlTargeted }).sort({created_at: 'desc'});

		// if there is no latest API request or it is time to make a request
		if (!mLastApiSportsRequest || (moment().unix() > mLastApiSportsRequest.created_at + REQUEST_DELAY_SECONDS[url])) {
			// get all available fixtures
			const fixturesResp = await axios.get(urlTargeted);
			
			// foreach fixture
			for (let fixtureRaw of fixturesResp.data.response) {
				// check if fixture has just finished
				let fixtureHasJustFinished = false;
				const mFixtureOld = await Fixture.findOne({external_id: fixtureRaw.fixture.id});
				if (mFixtureOld && mFixtureOld.status.short !== 'FT' && fixtureRaw.fixture.status.short === 'FT') {
					fixtureHasJustFinished = true;
				}

				// find home and away teams
				const mTeamHome = await Team.findOne({external_id: fixtureRaw.teams.home.id});
				const mTeamAway = await Team.findOne({external_id: fixtureRaw.teams.away.id});
				// find round
				const mRound = await Round.findOne({league_id: mLeague._id, season_id: mSeason._id, name: fixtureRaw.league.round});

				// create a new fixture or update an existing
				const fixtureData = {
					external_id: fixtureRaw.fixture.id,
					referee: fixtureRaw.fixture.referee,
					start_at: fixtureRaw.fixture.timestamp,
					periods: fixtureRaw.fixture.periods,
					venue: {...fixtureRaw.fixture.venue, ...{external_id: fixtureRaw.fixture.venue.id}},
					status: fixtureRaw.fixture.status,
					goals: fixtureRaw.goals,
					score: fixtureRaw.score,
					league_id: mLeague._id,
					season_id: mSeason._id,
					round_id: mRound._id,
					home_team_id: mTeamHome._id,
					away_team_id: mTeamAway._id
				};
				const mFixtureUpdated = await Fixture.findOneAndUpdate({external_id: fixtureRaw.fixture.id}, fixtureData, {upsert: true, new: true});

				// if fixture has just finished then add it to result finished fixtures array
				if (fixtureHasJustFinished) finishedFixtures.push(mFixtureUpdated);
			}

			// save API request to log
			const mApiSportsRequest = new ApiSportsRequest({ sport_id: mSport._id, url: urlTargeted });
			await mApiSportsRequest.save();
		}
	}

	// return finished fixtures models
	return finishedFixtures;
}

/**
 * Syncs team statistics.
 * Sync only when fixture is finished or on the 1st parser run.
 * NOTICE: may violate rate limit of 10 requests per minute.
 * TODO: make all requests with appropriate delay
 * @param {Array<Object>} leagues leagues data
 * leagues param ex:
 * [
 *     { league_id: 1, season: 2020 },
 *     { league_id: 2, season: 2020 }
 * ]
 * @param {Array<Object>} mFixturesFinished array of recently finished fixtures
 */
 async function syncTeamStatistics(leagues, mFixturesFinished) {
	// prepare API request url
	let url = '/teams/statistics';

	// update statistics for teams in finished fixtures
	for (let mFixtureFinished of mFixturesFinished) {
		// get models
		const mLeague = await League.findById(mFixtureFinished.league_id);
		const mSeason = await Season.findById(mFixtureFinished.season_id);
		const mTeamHome = await Team.findById(mFixtureFinished.home_team_id);
		const mTeamAway = await Team.findById(mFixtureFinished.away_team_id);

		// for home and away teams
		const mTeams = [mTeamHome, mTeamAway];
		for (let mTeam of mTeams) {
			// prepare url for iterated league
			const urlTargeted = `${url}?team=${mTeam.external_id}&league=${mLeague.external_id}&season=${mSeason.value}`;
			// get team statistics
			const teamStatisticsResp = await axios.get(urlTargeted);
			// create a new team statistics model or update an existing
			const data = {
				...teamStatisticsResp.data.response,
				team_id: mTeam._id,
				league_id: mLeague._id,
				season_id: mSeason._id
			};
			await TeamStatistics.findOneAndUpdate({team_id: mTeam._id, league_id: mLeague._id, season_id: mSeason._id}, data, {upsert: true});

			// save API request to log
			const mApiSportsRequest = new ApiSportsRequest({ sport_id: mSport._id, url: urlTargeted });
			await mApiSportsRequest.save();
		}
	}

	// make sure that all teams have statistics
	// for all provided leagues
	for (let league of leagues) {
		// get league and season models
		const mLeague = await League.findOne({external_id: league.league_id});
		const mSeason = await Season.findOne({value: league.season});

		// get all fixtures in league season
		const mFixtures = await Fixture.find({league_id: mLeague._id, season_id: mSeason._id});

		// for all fixtures in season
		for (let mFixture of mFixtures) {
			// get home and away team models
			const mTeamHome = await Team.findById(mFixture.home_team_id);
			const mTeamAway = await Team.findById(mFixture.away_team_id);

			// for home and away teams
			const mTeams = [mTeamHome, mTeamAway];
			for (let mTeam of mTeams) {
				// prepare url for iterated league
				const urlTargeted = `${url}?team=${mTeam.external_id}&league=${mLeague.external_id}&season=${mSeason.value}`;
				
				// get latest team statistics request
				const mLastApiSportsRequest = await ApiSportsRequest.findOne({ sport_id: mSport._id, url: urlTargeted }).sort({created_at: 'desc'});

				// if there is no latest API request or it is time to make a request
				if (!mLastApiSportsRequest || (moment().unix() > mLastApiSportsRequest.created_at + REQUEST_DELAY_SECONDS[url])) {
					// get team statistics
					const teamStatisticsResp = await axios.get(urlTargeted);
					// create a new team statistics model or update an existing
					const data = {
						...teamStatisticsResp.data.response,
						team_id: mTeam._id,
						league_id: mLeague._id,
						season_id: mSeason._id
					};
					await TeamStatistics.findOneAndUpdate({team_id: mTeam._id, league_id: mLeague._id, season_id: mSeason._id}, data, {upsert: true});

					// save API request to log
					const mApiSportsRequest = new ApiSportsRequest({ sport_id: mSport._id, url: urlTargeted });
					await mApiSportsRequest.save();
				}
			}
		}
	}
 }

 /**
 * Syncs standings(tables).
 * Sync only when fixture is finished or on the 1st parser run.
 * @param {Array<Object>} leagues leagues data
 * leagues param ex:
 * [
 *     { league_id: 1, season: 2020 },
 *     { league_id: 2, season: 2020 }
 * ]
 * @param {Array<Object>} mFixturesFinished array of recently finished fixtures
 */
 async function syncStandings(leagues, mFixturesFinished) {
	// prepare API request url
	let url = '/standings';

	// update statistics for teams in finished fixtures
	for (let mFixtureFinished of mFixturesFinished) {
		// get models
		const mLeague = await League.findById(mFixtureFinished.league_id);
		const mSeason = await Season.findById(mFixtureFinished.season_id);

		// prepare url for iterated league
		const urlTargeted = `${url}?league=${mLeague.external_id}&season=${mSeason.value}`;
		// get league standings
		const standingsResp = await axios.get(urlTargeted);

		// add team_id to all standing values
		for (let i = 0; i < standingsResp.data.response[0].league.standings[0].length; i++) {
			const mTeam = await Team.findOne({external_id: standingsResp.data.response[0].league.standings[0][i].team.id});
			standingsResp.data.response[0].league.standings[0][i]['team_id'] = mTeam._id;
		}

		// create a new standing model or update an existing
		const data = {
			values: standingsResp.data.response[0].league.standings[0],
			league_id: mLeague._id,
			season_id: mSeason._id
		};
		await Standing.findOneAndUpdate({league_id: mLeague._id, season_id: mSeason._id}, data, {upsert: true});

		// save API request to log
		const mApiSportsRequest = new ApiSportsRequest({ sport_id: mSport._id, url: urlTargeted });
		await mApiSportsRequest.save();
	}

	// make sure that all leagues have standings
	// for all provided leagues
	for (let league of leagues) {
		// get league and season models
		const mLeague = await League.findOne({external_id: league.league_id});
		const mSeason = await Season.findOne({value: league.season});

		// prepare url for iterated league
		const urlTargeted = `${url}?league=${mLeague.external_id}&season=${mSeason.value}`;
		// get latest league standings request
		const mLastApiSportsRequest = await ApiSportsRequest.findOne({ sport_id: mSport._id, url: urlTargeted }).sort({created_at: 'desc'});

		// if there is no latest API request or it is time to make a request
		if (!mLastApiSportsRequest || (moment().unix() > mLastApiSportsRequest.created_at + REQUEST_DELAY_SECONDS[url])) {
			// get league standings
			const standingsResp = await axios.get(urlTargeted);

			// add team_id to all standing values
			for (let i = 0; i < standingsResp.data.response[0].league.standings[0].length; i++) {
				const mTeam = await Team.findOne({external_id: standingsResp.data.response[0].league.standings[0][i].team.id});
				standingsResp.data.response[0].league.standings[0][i]['team_id'] = mTeam._id;
			}

			// create a new standing model or update an existing
			const data = {
				values: standingsResp.data.response[0].league.standings[0],
				league_id: mLeague._id,
				season_id: mSeason._id
			};
			await Standing.findOneAndUpdate({league_id: mLeague._id, season_id: mSeason._id}, data, {upsert: true});

			// save API request to log
			const mApiSportsRequest = new ApiSportsRequest({ sport_id: mSport._id, url: urlTargeted });
			await mApiSportsRequest.save();
		}
	}
 }

/**
 * Syncs head to head fixtures.
 * @param {Array<Object>} leagues leagues data
 * leagues param ex:
 * [
 *     { league_id: 1, season: 2020 },
 *     { league_id: 2, season: 2020 }
 * ]
 */
async function syncFixturesHeadToHead(leagues) {
	// prepare API request url
	let url = '/fixtures/headtohead';

	// for all provided leagues
	for (let league of leagues) {
		// get league and season models
		const mLeague = await League.findOne({external_id: league.league_id});
		const mSeason = await Season.findOne({value: league.season});

		// get number of fixtures in the next round
		const mStanding = await Standing.findOne({league_id: mLeague._id, season_id: mSeason._id});
		const teamsCount = mStanding.values.length;
		const fixturesInRoundCount = teamsCount / 2;

		// get next fixtures
		const mNextFixtures = await Fixture.find({'league_id': mLeague._id, 'season_id': mSeason._id, 'status.short': 'NS'}).limit(fixturesInRoundCount);
		
		// for each next fixture
		for (let mNextFixture of mNextFixtures) {
			// get home and away teams
			const mTeamHome = await Team.findById(mNextFixture.home_team_id);
			const mTeamAway = await Team.findById(mNextFixture.away_team_id);

			// prepare url for iterated fixture
			const urlTargeted = `${url}?h2h=${mTeamHome.external_id}-${mTeamAway.external_id}&last=10`;
			// get latest head to head fixtures request
			const mLastApiSportsRequest = await ApiSportsRequest.findOne({ sport_id: mSport._id, url: urlTargeted }).sort({created_at: 'desc'});

			// if there is no latest API request or it is time to make a request
			if (!mLastApiSportsRequest || (moment().unix() > mLastApiSportsRequest.created_at + REQUEST_DELAY_SECONDS[url])) {
				// get last head to head fixtures
				const headToHeadFixturesResp = await axios.get(urlTargeted);
				
				// foreach fixture
				for (let fixtureRaw of headToHeadFixturesResp.data.response) {
					// find home and away teams
					const mTeamHome = await Team.findOne({external_id: fixtureRaw.teams.home.id});
					const mTeamAway = await Team.findOne({external_id: fixtureRaw.teams.away.id});
					const mSeasonOld = await Season.findOne({value: fixtureRaw.league.season});
					
					// find round (create if it does not exist)
					let mRound = await Round.findOne({league_id: mLeague._id, season_id: mSeasonOld._id, name: fixtureRaw.league.round});
					if (!mRound) {
						mRound = new Round({league_id: mLeague._id, season_id: mSeasonOld._id, name: fixtureRaw.league.round});
						await mRound.save();
					}

					// create a new fixture or update an existing
					const fixtureData = {
						external_id: fixtureRaw.fixture.id,
						referee: fixtureRaw.fixture.referee,
						start_at: fixtureRaw.fixture.timestamp,
						periods: fixtureRaw.fixture.periods,
						venue: {...fixtureRaw.fixture.venue, ...{external_id: fixtureRaw.fixture.venue.id}},
						status: fixtureRaw.fixture.status,
						goals: fixtureRaw.goals,
						score: fixtureRaw.score,
						league_id: mLeague._id,
						season_id: mSeason._id,
						round_id: mRound._id,
						home_team_id: mTeamHome._id,
						away_team_id: mTeamAway._id
					};
					await Fixture.findOneAndUpdate({external_id: fixtureRaw.fixture.id}, fixtureData, {upsert: true, new: true});
				}

				// save API request to log
				const mApiSportsRequest = new ApiSportsRequest({ sport_id: mSport._id, url: urlTargeted });
				await mApiSportsRequest.save();
			}
		}
	}
}

 /**
 * Syncs statistics for finished fixtures.
 * @param {Array<Object>} mFixturesFinished array of recently finished fixtures
 */
async function syncFixturesStatistics(mFixturesFinished) {
	// prepare API request url
	let url = '/fixtures/statistics';

	// for all finished fixtures
	for (let mFixtureFinished of mFixturesFinished) {
		// prepare url for iterated fixture
		const urlTargeted = `${url}?fixture=${mFixtureFinished.external_id}`;

		// get fixture statistics
		const fixtureStatisticsResp = await axios.get(urlTargeted);

		// save fixture statistics
		const fixtureStatisticsData = {
			home_team_statistics: fixtureStatisticsResp.data.response[0].statistics,
			away_team_statistics: fixtureStatisticsResp.data.response[1].statistics,
			fixture_id: mFixtureFinished._id
		};
		const mFixtureStatistics = new FixtureStatistics(fixtureStatisticsData);
		await mFixtureStatistics.save();

		// save API request to log
		const mApiSportsRequest = new ApiSportsRequest({ sport_id: mSport._id, url: urlTargeted });
		await mApiSportsRequest.save();
	}
}

/**
 * Syncs players and theier league statistics
 * @param {Array<Object>} leagues leagues data
 * leagues param ex:
 * [
 *     { league_id: 1, season: 2020 },
 *     { league_id: 2, season: 2020 }
 * ]
 */
 async function syncPlayers(leagues) {
	// prepare API request url
	let url = '/players';

	// for all provided leagues
	for (let league of leagues) {
		
		// get league model
		const mLeague = await League.findOne({external_id: league.league_id});

		// for all pagination pages
		let pageCount = 1;
		for (let page = 1; page <= pageCount; page++) {
			// prepare url for iterated league
			const urlTargeted = `${url}?league=${league.league_id}&season=${league.season}&page=${page}`;

			// get latest request
			const mLastApiSportsRequest = await ApiSportsRequest.findOne({ sport_id: mSport._id, url: urlTargeted }).sort({created_at: 'desc'});

			// if there is no latest API request or it is time to make a request
			if (!mLastApiSportsRequest || (moment().unix() > mLastApiSportsRequest.created_at + REQUEST_DELAY_SECONDS[url])) {
				// get players for current page
				const playersResp = await axios.get(urlTargeted);
				// update last pagination page
				pageCount = playersResp.data.paging.total;

				// for all players
				for (let playerData of playersResp.data.response) {
					// add mongo league_id to statistics
					for (let i = 0; i < playerData.statistics.length; i++) {
						playerData.statistics[i].league_id = mLeague._id;
					}
					// save player
					await Player.findOneAndUpdate({external_id: playerData.player.id}, {...playerData.player, statistics: playerData.statistics}, {upsert: true});
				}

				// save API request to log
				const mApiSportsRequest = new ApiSportsRequest({ sport_id: mSport._id, url: urlTargeted });
				await mApiSportsRequest.save();
			}
		}
	}
}

 /**
 * Syncs fixture events.
 * @param {Array<Object>} mFixturesFinished array of recently finished fixtures
 */
  async function syncFixturesEvents(mFixturesFinished) {
	// prepare API request url
	let url = '/fixtures/events';

	// for all finished fixtures
	for (let mFixtureFinished of mFixturesFinished) {
		// prepare url for iterated fixture
		const urlTargeted = `${url}?fixture=${mFixtureFinished.external_id}`;

		// get fixture events
		const fixtureEventsResp = await axios.get(urlTargeted);

		// for all fixture events
		for (let fixtureRaw of fixtureEventsResp.data.response) {
			// prepare mongo model ids for fixture
			const mTeam = await Team.findOne({external_id: fixtureRaw.team.id});
			const mPlayer = await Player.findOne({external_id: fixtureRaw.player.id}); // can be null, for example when coach received a red card, he does not have a player id
			const mAssistPlayer = await Player.findOne({external_id: fixtureRaw.assist.id}); // can be null, for example for "yellow card" event
			// save event
			const fixtureEventData = {
				...fixtureRaw,
				fixture_id: mFixtureFinished._id,
				team_id: mTeam._id,
				player_id: mPlayer ? mPlayer._id : null,
				assist_player_id: mAssistPlayer ? mAssistPlayer._id : null,
			};
			// no "external id" in event, search by all event properties
			const fixtureEventSearchData = {
				time: fixtureRaw.time,
				type: fixtureRaw.type,
				detail: fixtureRaw.detail,
				comments: fixtureRaw.comments,
				fixture_id: mFixtureFinished._id,
				team_id: mTeam._id,
				player_id: mPlayer ? mPlayer._id : null,
				assist_player_id: mAssistPlayer ? mAssistPlayer._id : null,
			};
			await FixtureEvent.findOneAndUpdate(fixtureEventSearchData, fixtureEventData, {upsert: true});
		}

		// save API request to log
		const mApiSportsRequest = new ApiSportsRequest({ sport_id: mSport._id, url: urlTargeted });
		await mApiSportsRequest.save();
	}
}

/**
 * Syncs players and theier league statistics
 * @param {Array<Object>} leagues leagues data
 * leagues param ex:
 * [
 *     { league_id: 1, season: 2020 },
 *     { league_id: 2, season: 2020 }
 * ]
 */
async function syncFixturesLineups(leagues) {
	// prepare API request url
	let url = '/fixtures/lineups';

	// for all provided leagues
	for (let league of leagues) {
		// get league model
		const mLeague = await League.findOne({external_id: league.league_id});

		// find upcoming fixtures (40 minutes before the fixture start)
		const minutesBeforeTheFixtureStart = 40;
		const mUpcomingFixtures = await Fixture.find({
			league_id: mLeague._id,
			start_at: {
				$gt: moment().unix(),
				$lte: moment().unix() + minutesBeforeTheFixtureStart * 60
			}
		});

		// for all upcoming fixtures
		for (let mUpcomingFixture of mUpcomingFixtures) {
			// prepare url for iterated fixture
			const urlTargeted = `${url}?fixture=${mUpcomingFixture.external_id}`;

			// if lineup exists for home and away teams then proceed to next
			let mFixtureLineupHome = await FixtureLineup.findOne({fixture_id: mUpcomingFixture._id, team_id: mUpcomingFixture.home_team_id});
			let mFixtureLineupAway = await FixtureLineup.findOne({fixture_id: mUpcomingFixture._id, team_id: mUpcomingFixture.away_team_id});
			if (mFixtureLineupHome && mFixtureLineupAway) continue;

			// get latest request
			const mLastApiSportsRequest = await ApiSportsRequest.findOne({ sport_id: mSport._id, url: urlTargeted }).sort({created_at: 'desc'});
			// if there is no latest API request or it is time to make a request
			if (!mLastApiSportsRequest || (moment().unix() > mLastApiSportsRequest.created_at + REQUEST_DELAY_SECONDS[url])) {
				// get lineups
				const fixtureLineupsResp = await axios.get(urlTargeted);

				// for all fixture lineups
				for (let fixtureLineupRaw of fixtureLineupsResp.data.response) {
					// get team model
					const mTeam = await Team.findOne({external_id: fixtureLineupRaw.team.id});
					// save lineup
					const data = {
						...fixtureLineupRaw,
						start_11: fixtureLineupRaw.startXI.map(item => {
							item.player.external_id = item.player.id;
							return item;
						}),
						substitutes: fixtureLineupRaw.substitutes.map(item => {
							item.player.external_id = item.player.id;
							return item;
						}),
						coach: {
							external_id: fixtureLineupRaw.coach.id,
							name: fixtureLineupRaw.coach.name,
						},
						fixture_id: mUpcomingFixture._id, 
						team_id: mTeam._id
					};
					await FixtureLineup.findOneAndUpdate({fixture_id: mUpcomingFixture._id, team_id: mTeam._id}, data, {upsert: true});
				}

				// save API request to log
				const mApiSportsRequest = new ApiSportsRequest({ sport_id: mSport._id, url: urlTargeted });
				await mApiSportsRequest.save();
			}
		}
	}
}

/**
 * Syncs players statistics in fixture.
 * @param {Array<Object>} mFixturesFinished array of recently finished fixtures
 */
async function syncFixturesPlayersStatistics(mFixturesFinished) {
	// prepare API request url
	let url = '/fixtures/players';

	// for all finished fixtures
	for (let mFixtureFinished of mFixturesFinished) {
		// prepare url for iterated fixture
		const urlTargeted = `${url}?fixture=${mFixtureFinished.external_id}`;

		// get players statistics
		const fixturePlayersStatisticsResp = await axios.get(urlTargeted);

		// for all teams in response
		for (let teamStatisticsRaw of fixturePlayersStatisticsResp.data.response) {
			// get team model
			const mTeam = await Team.findOne({external_id: teamStatisticsRaw.team.id});

			// for all players in a team
			for (let playerStaisticsRaw of teamStatisticsRaw.players) {
				// get player model
				const mPlayer = await Player.findOne({external_id: playerStaisticsRaw.player.id});

				// save player statistics
				const data = {
					statistics: playerStaisticsRaw.statistics,
					fixture_id: mFixtureFinished._id,
					team_id: mTeam._id,
					player_id: mPlayer._id,
				};
				await FixturePlayerStatistics.findOneAndUpdate({
					fixture_id: mFixtureFinished._id, 
					team_id: mTeam._id,
					player_id: mPlayer._id
				}, data, {upsert: true});
			}
		}

		// save API request to log
		const mApiSportsRequest = new ApiSportsRequest({ sport_id: mSport._id, url: urlTargeted });
		await mApiSportsRequest.save();
	}
}

/**
 * Syncs predictions for upcoming fixtures.
 * @param {Array<Object>} leagues leagues data
 * leagues param ex:
 * [
 *     { league_id: 1, season: 2020 },
 *     { league_id: 2, season: 2020 }
 * ]
 */
 async function syncFixturesPredictions(leagues) {
	// prepare API request url
	let url = '/predictions';

	// for all provided leagues
	for (let league of leagues) {
		// get league and season models
		const mLeague = await League.findOne({external_id: league.league_id});
		const mSeason = await Season.findOne({value: league.season});

		// get number of fixtures in the next round
		const mStanding = await Standing.findOne({league_id: mLeague._id, season_id: mSeason._id});
		const teamsCount = mStanding.values.length;
		const fixturesInRoundCount = teamsCount / 2;

		// get next fixtures
		const mNextFixtures = await Fixture.find({'league_id': mLeague._id, 'season_id': mSeason._id, 'status.short': 'NS'}).limit(fixturesInRoundCount);
		
		// for each next fixture
		for (let mNextFixture of mNextFixtures) {
			// if prediction exists then proceed to next
			let mFixturePrediction = await FixturePrediction.findOne({fixture_id: mNextFixture._id});
			if (mFixturePrediction) continue;

			// prepare url for iterated fixture
			const urlTargeted = `${url}?fixture=${mNextFixture.external_id}`;

			// get prediction response
			const fixturePredictionResp = await axios.get(urlTargeted);

			// for all predictions in response
			for (let fixturePredictionRaw of fixturePredictionResp.data.response) {
				// set team external id for winner team
				fixturePredictionRaw.predictions.winner.external_id = fixturePredictionRaw.predictions.winner.id;
				// save fixture prediction
				const data = {
					...fixturePredictionRaw.predictions,
					comparison: fixturePredictionRaw.comparison,
					fixture_id: mNextFixture._id,
				};
				await FixturePrediction.findOneAndUpdate({fixture_id: mNextFixture._id}, data, {upsert: true});
			}

			// save API request to log
			const mApiSportsRequest = new ApiSportsRequest({ sport_id: mSport._id, url: urlTargeted });
			await mApiSportsRequest.save();
		}
	}
}

module.exports = {
	sync
};
