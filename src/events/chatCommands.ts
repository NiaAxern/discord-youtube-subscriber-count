/** @format */
import { Events } from 'discord.js';
import djs_client from '../client';

import commands from '../commands';
import logger from '../logging';

import type { CommandType } from '../types/commands';

djs_client.on(Events.InteractionCreate, async (interaction) => {
	if (interaction.isChatInputCommand()) {
		const getCommand: CommandType = commands.get(interaction.command?.id);
		if (!getCommand)
			logger.warn(
				`${interaction.user.displayName} tried to do /${interaction.command?.name} (${interaction.command?.id}) but it wasn't found.`,
			);
		return getCommand.execute(interaction);
	}
});
