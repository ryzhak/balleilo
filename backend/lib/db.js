const mongoose = require('mongoose');

let db = null;

/**
 * Connects to mongo db
 */
function connect() {
	return new Promise((resolve, reject) => {
		mongoose.connect(process.env.MONGO_DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });
		db = mongoose.connection;
		db.on('error', (err) => {
			reject(err);
		});
		db.once('open', () => {
			console.log(`Connected to MongoDB at ${process.env.MONGO_DB_CONNECTION}`)
			resolve(db);
		});
	});
};

module.exports = {
	conn: db,
	connect,
};
