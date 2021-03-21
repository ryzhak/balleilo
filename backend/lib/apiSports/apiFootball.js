const axios = require('axios');
const moment = require('moment');

const ApiSportsRequest = require('../../models/api_sports/ApiSportsRequest');
const Country = require('../../models/api_sports/football/Country');
const League = require('../../models/api_sports/football/League');
const Season = require('../../models/api_sports/football/Season');
const Timezone = require('../../models/api_sports/football/Timezone');
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

	//====================
	// Sync global objects
	//====================
	// await syncTimezones();
	// await syncCountries();
	// await syncLeaguesSeasons();
	// await syncLeagues();

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

	// if there is not latest API request or it is time to make a request
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


module.exports = {
	sync
};
