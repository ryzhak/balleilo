const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	name: {
		type: String,
		required: true
	},
}, {
	collection: 'app_sport'
});

const Sport = mongoose.model('Sport', modelSchema);

module.exports = Sport;
