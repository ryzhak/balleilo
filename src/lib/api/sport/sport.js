import axios from 'axios';

/**
 * Returns all sports
 */
async function search() {
	return await axios.get('/sport');
}

export default {
	search,
}
