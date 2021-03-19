const moment = require('moment');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	external_id: {
		type: Number,
		required: true,
	},
	start_at: {
		type: Number,
		required: true,
	},
	status: {
		type: String,
		required: true,
		default: 'NS' // available statuses: "NS" => "Not Started", "FT" => "Match Finished (Full Time)"
	},
	home_team_name: {
		type: String,
		required: true,
	},
	away_team_name: {
		type: String,
		required: true,
	},
	goals_home: {
		type: Number,
		default: null
	},
	goals_away: {
		type: Number,
		default: null
	},
	created_at: {
		type: Number,
		required: true,
		default: moment().unix()
	},
});

const Fixture = mongoose.model('Fixture', modelSchema);

module.exports = Fixture;
