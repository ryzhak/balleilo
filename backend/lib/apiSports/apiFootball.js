const axios = require('axios');
const moment = require('moment');

const ApiSportsRequest = require('../../models/api_sports/ApiSportsRequest');
const Country = require('../../models/api_sports/football/Country');
const League = require('../../models/api_sports/football/League');
const Round = require('../../models/api_sports/football/Round');
const Season = require('../../models/api_sports/football/Season');
const Team = require('../../models/api_sports/football/Team');
const Timezone = require('../../models/api_sports/football/Timezone');
const Venue = require('../../models/api_sports/football/Venue');
const Sport = require('../../models/app/Sport');

axios.defaults.baseURL = 'https://v3.football.api-sports.io';
axios.defaults.headers.common['x-apisports-key'] = process.env.API_SPORTS_KEY;

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
};

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

	// sync data connected to provided leagues and seasons
	console.log('===sync===');
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

module.exports = {
	sync
};
