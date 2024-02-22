/** @format */

import { ActivityType, Events } from 'discord.js';
import djs_client from '../client';
import logger from '../logging';

djs_client.once(Events.ClientReady, async (bot) => {
	logger.info(`Ready! Logged in as ${bot.user.tag}`);
	bot.user.setPresence({
		activities: [
			{
				name: `Updating ${bot.guilds.cache.size} servers.`,
				type: ActivityType.Custom,
			},
		],
		status: 'online',
	});
});
process.on('unhandledRejection', (err: any) /* eslint-disable-line */ => {
	logger.fatal('Uncaught Promise Error:' + err);
	process.exit(1);
});
