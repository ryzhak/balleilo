import axios from 'axios';

// import APIs
import user from './user/user';

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_API_URL;
axios.defaults.headers.common['Authorization'] = localStorage.getItem('api_balleilo_key');

export default {
	user
}
