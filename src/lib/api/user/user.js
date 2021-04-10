import axios from 'axios';

/**
 * Logins to the system
 * @param {Object} params params
 * params ex:
 * {
 *   api_balleilo_key: 'ANY'
 * }  
 */
async function login(params: Object) {
	return await axios.post('/user/login', params);
}

export default {
	login
}
