/**
 * Backend logger.
 * Used for:
 * - http errors
 */

const bunyan = require('bunyan');

// create logger
const logger = bunyan.createLogger({
    name: 'http-errors',
    streams: [{
        type: 'rotating-file',
        path: `${__dirname}/../../log/http-errors.log`,
        period: '1d', // daily rotation
        count: 7, // keep 7 back copies
    }]
});

module.exports = logger;
