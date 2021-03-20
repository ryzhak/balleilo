const axios = require('axios');
const moment = require('moment');

const ApiSportsRequest = require('../../models/api_sports/ApiSportsRequest');
const Country = require('../../models/api_sports/football/Country');
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

module.exports = {
	sync
};
