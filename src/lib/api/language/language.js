import axios from 'axios';

/**
 * Returns all languages
 */
async function search() {
	return await axios.get('/language');
}

export default {
	search,
}
