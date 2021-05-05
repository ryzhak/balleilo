const express = require('express');
const { body, param, validationResult } = require('express-validator');

const logger = require('../lib/logger');
const Channel = require('../models/app/Channel');
const Language = require('../models/app/Language');
const Team = require('../models/api_sports/football/Team');
const SocialMediaPlatform = require('../models/app/SocialMediaPlatform');
const Sport = require('../models/app/Sport');
const Template = require('../models/app/Template');

const router = express.Router();

/**
 * Get all available models
 */
 router.get(
	'/',
	async (req, res) => {
		// get all models
		try {
			const models = await Channel.find().populate('teams templates social_media_platform language sport');
			res.send(models);
		} catch (err) {
			console.log(err);
			logger.error(err);
			res.status(500).send({errors: [{ msg: err }]});
		}
	}
);

/**
 * Create a new model
 */
 router.post(
	'/',
	body('external_id').isLength({ min: 1 }),
	body('team_ids').custom(async (values) => {
		for (let value of values) {
			const model = await Team.findById(value);
			if (!model) return Promise.reject(`Model with id ${value} not found`);
		}
		return Promise.resolve();
	}),
	body('template_ids').custom(async (values) => {
		for (let value of values) {
			const model = await Template.findById(value);
			if (!model) return Promise.reject(`Model with id ${value} not found`);
		}
		return Promise.resolve();
	}),
	body('social_media_platform_id').custom(async (value) => await SocialMediaPlatform.findById(value) ? Promise.resolve() : Promise.reject('Model not found')),
	body('sport_id').custom(async (value) => await Sport.findById(value) ? Promise.resolve() : Promise.reject('Model not found')),
	body('language_id').custom(async (value) => await Language.findById(value) ? Promise.resolve() : Promise.reject('Model not found')),
	async (req, res) => {
		// validation
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).send(errors);
		// create a new model
		try {
			const model = new Channel(req.body);
			await model.save();
			res.send(model);
		} catch (err) {
			console.log(err);
			logger.error(err);
			res.status(500).send({errors: [{ msg: err }]});
		}
	}
);

/**
 * Update a model
 */
 router.patch(
	'/:id',
	param('id').isMongoId(),
	// check that model exists
	param('id').custom(async (value) => await Channel.findById(value) ? Promise.resolve() : Promise.reject('Model not found')),
	body('external_id').isLength({ min: 1 }),
	body('team_ids').custom(async (values) => {
		for (let value of values) {
			const model = await Team.findById(value);
			if (!model) return Promise.reject(`Model with id ${value} not found`);
		}
		return Promise.resolve();
	}),
	body('template_ids').custom(async (values) => {
		for (let value of values) {
			const model = await Template.findById(value);
			if (!model) return Promise.reject(`Model with id ${value} not found`);
		}
		return Promise.resolve();
	}),
	body('social_media_platform_id').custom(async (value) => await SocialMediaPlatform.findById(value) ? Promise.resolve() : Promise.reject('Model not found')),
	body('sport_id').custom(async (value) => await Sport.findById(value) ? Promise.resolve() : Promise.reject('Model not found')),
	body('language_id').custom(async (value) => await Language.findById(value) ? Promise.resolve() : Promise.reject('Model not found')),
	async (req, res) => {
		// validation
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).send(errors);
		// update a model
		try {
			const model = await Channel.findByIdAndUpdate(req.params.id, req.body, {new: true});
			res.send(model);
		} catch (err) {
			console.log(err);
			logger.error(err);
			res.status(500).send({errors: [{ msg: err }]});
		}
	}
);

/**
 * Delete a model
 */
 router.delete(
	'/:id',
	param('id').isMongoId(),
	// check that model exists
	param('id').custom(async (value) => await Channel.findById(value) ? Promise.resolve() : Promise.reject('Model not found')),
	async (req, res) => {
		// validation
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).send(errors);
		// delete a model
		try {
			await Channel.findByIdAndDelete(req.params.id);
			res.send();
		} catch (err) {
			console.log(err);
			logger.error(err);
			res.status(500).send({errors: [{ msg: err }]});
		}
	}
);

module.exports = router;
