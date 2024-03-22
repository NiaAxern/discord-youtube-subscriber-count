/** @format */
import { Events } from 'discord.js';
import djs_client from '../client';

import commands from '../commands';
import logger from '../logging';

import type { CommandType } from '../types/commands';

djs_client.on(Events.InteractionCreate, async (interaction) => {
	if (interaction.isAutocomplete()) {
		const getCommand: CommandType = commands.get(interaction.commandName);
		if (!getCommand?.autoComplete)
			return console.log(
				`${interaction.user.displayName} tried to do autocomplete for /${interaction.commandName} (${interaction.commandId}) but it wasn't found.`,
			);
		return getCommand.autoComplete(interaction);
	}
});
