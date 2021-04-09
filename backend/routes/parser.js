const { response } = require('express');
const express = require('express');
const { body, param, validationResult } = require('express-validator');

const Parser = require('../models/app/Parser');

const router = express.Router();

/**
 * Get all available models
 */
router.get(
	'/',
	async (req, res) => {
		// get all models
		try {
			const models = await Parser.find();
			res.send(models);
		} catch (err) {
			console.log(err);
			res.status(500).send({errors: [{ msg: err }]});
		}
	}
);

/**
 * Create a new model
 */
router.post(
	'/',
	body('league').isInt({ min: 0 }),
	body('season').isInt({ min: 0 }),
	body('desc').isAscii(),
	async (req, res) => {
		// validation
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).send(errors);
		// create a new model
		try {
			const model = new Parser(req.body);
			await model.save();
			res.send(model);
		} catch (err) {
			console.log(err);
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
	param('id').custom(async (value) => await Parser.findById(value) ? Promise.resolve() : Promise.reject('Model not found')),
	body('league').isInt({ min: 0 }),
	body('season').isInt({ min: 0 }),
	body('desc').isAscii(),
	async (req, res) => {
		// validation
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).send(errors);
		// update a model
		try {
			const model = await Parser.findByIdAndUpdate(req.params.id, req.body, {new: true});
			res.send(model);
		} catch (err) {
			console.log(err);
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
	param('id').custom(async (value) => await Parser.findById(value) ? Promise.resolve() : Promise.reject('Model not found')),
	async (req, res) => {
		// validation
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).send(errors);
		// delete a model
		try {
			await Parser.findByIdAndDelete(req.params.id);
			res.send();
		} catch (err) {
			console.log(err);
			res.status(500).send({errors: [{ msg: err }]});
		}
	}
);

module.exports = router;
