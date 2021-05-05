const express = require('express');
const { body, param, validationResult } = require('express-validator');

const logger = require('../lib/logger');
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
			const models = await Template.find();
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
	body('html').isLength({ min: 1 }),
	body('name').isLength({ min: 1 }),
	body('desc').optional(),
	body('query').isLength({ min: 1 }),
	body('publish_strategy.name').isIn([Template.PUBLISH_STRATEGY.NOW, Template.PUBLISH_STRATEGY.DELAY_SECONDS, Template.PUBLISH_STRATEGY.ACCURATE_TIMESTAMP]),
	body('publish_strategy.value').isInt({ min: 0 }),
	async (req, res) => {
		// validation
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).send(errors);
		// create a new model
		try {
			const model = new Template(req.body);
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
	param('id').custom(async (value) => await Template.findById(value) ? Promise.resolve() : Promise.reject('Model not found')),
	body('html').isLength({ min: 1 }),
	body('name').isLength({ min: 1 }),
	body('desc').optional(),
	body('query').isLength({ min: 1 }),
	body('publish_strategy.name').isIn([Template.PUBLISH_STRATEGY.NOW, Template.PUBLISH_STRATEGY.DELAY_SECONDS, Template.PUBLISH_STRATEGY.ACCURATE_TIMESTAMP]),
	body('publish_strategy.value').isInt({ min: 0 }),
	async (req, res) => {
		// validation
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).send(errors);
		// update a model
		try {
			const model = await Template.findByIdAndUpdate(req.params.id, req.body, {new: true});
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
	param('id').custom(async (value) => await Template.findById(value) ? Promise.resolve() : Promise.reject('Model not found')),
	async (req, res) => {
		// validation
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).send(errors);
		// delete a model
		try {
			await Template.findByIdAndDelete(req.params.id);
			res.send();
		} catch (err) {
			console.log(err);
			logger.error(err);
			res.status(500).send({errors: [{ msg: err }]});
		}
	}
);

module.exports = router;
