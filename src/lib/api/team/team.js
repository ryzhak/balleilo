import axios from 'axios';

/**
 * Returns all teams
 */
async function search() {
	return await axios.get('/team');
}

export default {
	search,
}
