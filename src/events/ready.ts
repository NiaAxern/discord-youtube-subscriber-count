/** @format */

import { Events } from 'discord.js';
import djs_client from '../client';
import logger from '../logging';


djs_client.on(Events.ClientReady, async (bot) => {
	logger.info(`Ready! Logged in as ${bot.user.tag}`);
});
