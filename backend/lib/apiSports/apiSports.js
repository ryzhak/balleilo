/**
 * API sports DB sync lib
 */

const apiFootball = require('./apiFootball');

/**
 * Syncs DB with the latest data
 * @param {string} sportName sport name, available values: "baseball", "basketball", "football", "formula_1", "hockey", "rugby" 
 * @param {Object} params params based on sports
 * params ex(football):
 * {
 *   leagues: [
 *     { league_id: 1, season: 2020 },
 *     { league_id: 2, season: 2020 }
 *   ]
 * } 
 */
async function sync(sportName, params = {}) {
	if (sportName === 'football') await apiFootball.sync(params);
} 

module.exports = {
	sync
};
