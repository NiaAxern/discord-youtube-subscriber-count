/** @format */

import { SlashCommandBuilder } from 'discord.js';

import type { Commands } from '../types/commands';

const commands: Commands = {
	ping: {
		data: new SlashCommandBuilder()
			.setName('ping')
			.setDescription('Check the ping of the bot!'),
		execute: async (interaction) => {
			await interaction.reply({
				ephemeral: true,
				content: `Ping: ${interaction.client.ws.ping}ms`,
			});
		},
	},
};

export default commands;
