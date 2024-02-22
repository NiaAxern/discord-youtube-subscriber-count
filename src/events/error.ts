/** @format */

import { Events } from 'discord.js';
import djs_client from '../client';
import logger from '../logging';

djs_client.on(Events.Error, (error) => {
	logger.error(error);
});
