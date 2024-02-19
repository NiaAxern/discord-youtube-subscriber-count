/** @format */

import {
	SlashCommandBuilder
} from 'discord.js';

import type { Commands } from '../types/commands';

const commands: Commands = {
	ping: {
		data: new SlashCommandBuilder()
			.setName('ping')
			.setDescription('Replies with Pong!'),
		execute: async (interaction) => {
			await interaction.reply(`Ping: ${interaction.client.ws.ping}ms`);
		},
	},
};

export default commands;
