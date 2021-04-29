const moment = require('moment');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const modelSchema = new Schema({
	html: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	desc: {
		type: String,
		default: null
	},
	query: {
		type: String,
		required: true
	},
	publish_strategy: {
		name: {
			type: String,
			enum: ['now', 'delay_seconds', 'accurate_timestamp'],
			required: true
		},
		value: {
			type: Number,
			required: true
		},
	},
	created_at: {
		type: Number,
		required: true,
		default: moment().unix()
	},
}, {
	collection: 'app_template'
});

// pubish strategy constancts
modelSchema.statics.PUBLISH_STRATEGY = {
	NOW: 'now',
	DELAY_SECONDS: 'delay_seconds',
	ACCURATE_TIMESTAMP: 'accurate_timestamp'
};

/**
 * Returns publication timestamp based on template's publish strategy
 * @returns {Number} publication timestamp
 */
modelSchema.methods.getPublishAtTimestamp = function() {
	let publish_at = 0;
	if (this.publish_strategy.name === modelSchema.statics.PUBLISH_STRATEGY.NOW) {
		publish_at = moment().unix();
	}
	if (this.publish_strategy.name === modelSchema.statics.PUBLISH_STRATEGY.DELAY_SECONDS) {
		publish_at = moment().unix() + this.publish_strategy.value;
	}
	if (this.publish_strategy.name === modelSchema.statics.PUBLISH_STRATEGY.ACCURATE_TIMESTAMP) {
		publish_at = this.publish_strategy.value;
	}
	return publish_at;
};

const Template = mongoose.model('Template', modelSchema);

module.exports = Template;
