import axios from 'axios';

/**
 * Returns all social media platforms
 */
async function search() {
	return await axios.get('/social-media-platform');
}

export default {
	search,
}
