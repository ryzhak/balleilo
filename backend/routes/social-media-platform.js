const { response } = require('express');
const express = require('express');
const { body, param, validationResult } = require('express-validator');

const logger = require('../lib/logger');
const SocialMediaPlatform = require('../models/app/SocialMediaPlatform');

const router = express.Router();

/**
 * Get all available models
 */
router.get(
	'/',
	async (req, res) => {
		// get all models
		try {
			const models = await SocialMediaPlatform.find();
			res.send(models);
		} catch (err) {
			console.log(err);
			logger.error(err);
			res.status(500).send({errors: [{ msg: err }]});
		}
	}
);

module.exports = router;
