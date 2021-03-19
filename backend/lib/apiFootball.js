const axios = require('axios');

axios.defaults.baseURL = 'https://v3.football.api-sports.io';
// TODO: move to env variable
axios.defaults.headers.common['x-apisports-key'] = '53e6b12f308ecd734cff5c986fb25842';

async function getFixtures(leagueId, seasonId) {
	return await axios.get('/fixtures', {
		params: {
			league: leagueId,
			season: seasonId
		}
	});
}

module.exports = {
	getFixtures
};
