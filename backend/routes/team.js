const { response } = require('express');
const express = require('express');
const { body, param, validationResult } = require('express-validator');

const Team = require('../models/api_sports/football/Team');

const router = express.Router();

/**
 * Get all available models
 */
router.get(
	'/',
	async (req, res) => {
		// get all models
		try {
			const models = await Team.find();
			res.send(models);
		} catch (err) {
			console.log(err);
			res.status(500).send({errors: [{ msg: err }]});
		}
	}
);

module.exports = router;
