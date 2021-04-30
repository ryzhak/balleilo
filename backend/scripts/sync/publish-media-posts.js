/**
 * Publishes scheduled media posts
 */

// setup path for env file in order for script to work in production
require('dotenv').config({ path: `${__dirname}/../../../.env` });

const moment = require('moment');
const nodeHtmlToImageLib = require('node-html-to-image');
const TelegramBot = require('node-telegram-bot-api');

const db = require('../../lib/db');
const Channel = require('../../models/app/Channel');
const ScheduledPost = require('../../models/app/ScheduledPost');
const SocialMediaPlatform = require('../../models/app/SocialMediaPlatform');
const Template = require('../../models/app/Template');

// prepare telegram bot for posting news
const telegramBot = new TelegramBot(process.env.TELEGRAM_BOT_API_TOKEN);

/**
 * Main function
 */
async function run() {
	let dbConn = null;
	try {
		// create DB connection
		dbConn = await db.connect();

		// for all not published media posts and that should be published
		const mScheduledPosts = await ScheduledPost.find({
			published_at: null,
			publish_at: {
				$lte: moment().unix()
			}
		});
		for (let mScheduledPost of mScheduledPosts) {
			// get models
			const mChannel = await Channel.findById(mScheduledPost.channel_id);
			const mTemplate = await Template.findById(mScheduledPost.template_id);
			const mSocialMediaPlatform = await SocialMediaPlatform.findById(mChannel.social_media_platform_id);

			// generate image from html template
			const imagePath = `${__dirname}/../../assets/media_posts/${String(mScheduledPost._id)}.png`
			await nodeHtmlToImageLib({
				html: mTemplate.html,
				output: imagePath,
				content: mScheduledPost.data,
			});
			console.log(`generated image: ${imagePath}`);

			// publish image to channel
			if (mSocialMediaPlatform.name === 'telegram') {
				// send image to telegram bot
				await telegramBot.sendPhoto(mChannel.external_id, imagePath);
				console.log(`published image: ${imagePath}`);
				// telegram bot can not send more than 20 messages per minute in the same group(channel) due to API rate limit
				const MAX_REQUESTS_PER_MINUTE = 20;
				// increase timeout a little bit so that we could bypass the rate limit for sure
				const timeoutSeconds = 70 / MAX_REQUESTS_PER_MINUTE;
				// apply timeout
				await new Promise(resolve => setTimeout(resolve, timeoutSeconds * 1000));
			}

			// mark scheduled post as published
			mScheduledPost.published_at = moment().unix();
			await mScheduledPost.save();
		}

		// show success message
		console.log('===published successfully===');
	} catch (err) {
		console.log('===ERROR===');
		console.log(err);
	} finally {
		dbConn.close();
	}
}

// run main function
run();
