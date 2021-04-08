const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

/**
 * Login by secret key
 */
router.post(
	'/login',
	body('api_balleilo_key').isLength({ min: 1 }), 
	(req, res) => {
		// validation
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.status(400).send(errors);
		// check that key is valid
		if (req.body.api_balleilo_key === process.env.API_BALLEILO_KEY) {
			res.send({ role: 'admin' });
		} else {
			res.status(403).send({errors: [{ msg: 'Invalid secret key' }]});
		}
	}
);

module.exports = router;
