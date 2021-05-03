import axios from 'axios';

// import APIs
import channel from './channel/channel';
import language from './language/language';
import parser from './parser/parser';
import socialMediaPlatform from './social_media_platform/socialMediaPlatform';
import sport from './sport/sport';
import team from './team/team';
import template from './template/template';
import user from './user/user';

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_API_URL;
axios.defaults.headers.common['Authorization'] = localStorage.getItem('api_balleilo_key');

export default {
	channel,
	language,
	parser,
	socialMediaPlatform,
	sport,
	team,
	template,
	user,
}
