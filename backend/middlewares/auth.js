/**
 * Restricts access only for authorized users
 * @param {Object} req express request object 
 * @param {Object} res express response object 
 * @param {Function} next experss next function handler 
 */
function restrict(req, res, next) {
	// check that key in Authorization header is the correct one
	if (req.headers['authorization'] !== process.env.API_BALLEILO_KEY) {
		res.status(403).send({errors: [{ msg: 'Invalid authorization header' }]});
	} else {
		next();
	}
}

module.exports = {
	restrict
};
