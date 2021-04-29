/**
 * Schedules media posts for future publishing
 */

// setup path for env file in order for script to work in production
require('dotenv').config({ path: `${__dirname}/../../../.env` });

const objectHashLib = require('object-hash');
const moment = require('moment');

const db = require('../../lib/db');
const Team = require('../../models/api_sports/football/Team');
const Channel = require('../../models/app/Channel');
const ScheduledPost = require('../../models/app/ScheduledPost');
const Template = require('../../models/app/Template');

/**
 * Main function
 */
async function run() {
	let dbConn = null;
	try {
		// create DB connection
		dbConn = await db.connect();

		// for all channels
		const mChannels = await Channel.find();
		for (let mChannel of mChannels) {
			// for all teams in channel
			for (let teamId of mChannel.team_ids) {
				const mTeam = await Team.findById(teamId);
				// for all templates in channel
				for (let templateId of mChannel.template_ids) {
					const mTemplate = await Template.findById(templateId);
					// get query results
					const results = await eval(`(async () => { return await dbConn.${mTemplate.query}.toArray(); })()`);
					// for all query results
					for (let result of results) {
						// if result contains "_id" property which is of type ObjectId then convert it to string so that "object-hash" could create a hash from this object
						if (result._id) result._id = String(result._id);
						// if scheduled post with unique hash does not exist then create a new one, unique hash is calculated as result + template_id + channel_id
						const uniqueHash = objectHashLib({...result, template_id: String(mTemplate._id), channel_id: String(mChannel._id)});
						let mScheduledPost = await ScheduledPost.findOne({unique_hash: uniqueHash});
						if (!mScheduledPost) {
							mScheduledPost = new ScheduledPost({
								publish_at: mTemplate.getPublishAtTimestamp(),
								published_at: null,
								data: result,
								unique_hash: uniqueHash,
								channel_id: mChannel._id,
								template_id: mTemplate._id,
							});
							await mScheduledPost.save();
						}
					}
				}
			}
		}

		// show success message
		console.log('===scheduled successfully===');
	} catch (err) {
		console.log('===ERROR===');
		console.log(err);
	} finally {
		dbConn.close();
	}
}

// run main function
run();
