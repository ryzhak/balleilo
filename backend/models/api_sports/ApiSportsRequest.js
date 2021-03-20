const moment = require('moment');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	url: {
		type: String,
		required: true
	},
	sport_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	created_at: {
		type: Number,
		required: true,
		default: moment().unix()
	},
}, {
	collection: 'app_api_sports_request'
});

const ApiSportsRequest = mongoose.model('ApiSportsRequest', modelSchema);

module.exports = ApiSportsRequest;
