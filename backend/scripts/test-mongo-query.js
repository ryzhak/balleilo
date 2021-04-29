// setup path for env file in order for script to work in production
require('dotenv').config({ path: `${__dirname}/../../.env` });

const moment = require('moment');
const ObjectId  = require('mongodb').ObjectID;

const db = require('../lib/db');
const Channel = require('../models/app/Channel');

/**
 * Main function
 */
 async function run() {
	let dbConn = null;
	try {
		// create DB connection
		dbConn = await db.connect();

		// for league
		// for single team channel

		// special variables
		// [!team._id] // iterated team id
		// [!channel.news_tags]

		// find latest played fixture
		// const result = await dbConn.db.collection('api_football_fixture').aggregate([
		// 	{$match: {$or: [{home_team_id: ObjectId('6058f53d87a4d41f2b1df1e1')},{away_team_id: ObjectId('6058f53d87a4d41f2b1df1e1')}], "status.short": "FT"}}, 
		// 	{$lookup: {from: "api_football_team", localField: "home_team_id", foreignField: "_id", as: "home_team"}}, 
		// 	{$lookup: {from: "api_football_team", localField: "away_team_id", foreignField: "_id", as: "away_team"}}, 
		// 	{$sort: {start_at: -1}}, {$limit: 1}, 
		// 	{$unwind: "$home_team"}, 
		// 	{$unwind: "$away_team"}, 
		// 	{$project: {"_id": 1, "goals.home": 1, "goals.away": 1, "home_team.name": 1, "away_team.name": 1}}
		// ]).toArray();

		// find latest news where tag contains "ФК Сочи" or "Максим Мухин"
		// const mChannel = await Channel.findOne({external_id: '@fckrd1'});
		// const result = await dbConn.db.collection('app_news').aggregate([
		// 	{$match: { 
		// 		tags: { $in: mChannel.news_tags},
		// 	}},
		// 	{$sort: {created_at: -1}}, 
		// 	{$limit: 20}, 
		// 	{$project: {
		// 		'_id': 1, 
		// 		'title': 1
		// 	}},
		// ]).toArray();

		// console.log(result);

		// eval code
		// console.log(await eval('(async () => { return await dbConn.db.collection("api_football_fixture").aggregate().toArray(); })()'));

		// add template_id and channel id to data (virtually)
		// if object hash does not exist then create a scheduled post
	} catch (err) {
		console.log('===ERROR===');
		console.log(err);
	} finally {
		dbConn.close();
	}
}

// run main function
run();
