/** @format */

import { Events } from 'discord.js';
import djs_client from '../client';
import logger from '../logging';

djs_client.on(Events.Warn, (warn) => {
	logger.warn(warn);
});