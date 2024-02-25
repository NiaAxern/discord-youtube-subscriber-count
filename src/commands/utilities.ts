/** @format */

import { SlashCommandBuilder } from 'discord.js';

import type { Commands } from '../types/commands';
import { heapStats } from 'bun:jsc';
import { dirSize } from '../utilities';
import logger from '../logging';
const commands: Commands = {
	ping: {
		data: new SlashCommandBuilder()
			.setName('ping')
			.setDescription('Check the ping of the bot!'),
		execute: async (interaction) => {
			await interaction.reply({
				ephemeral: true,
				content: `Ping: ${interaction.client.ws.ping}ms`,
			}).catch(logger.error);
		},
	},
	uptime: {
		data: new SlashCommandBuilder()
			.setName('uptime')
			.setDescription('Check the uptime of the bot!'),
		execute: async (interaction) => {
			await interaction.reply({
				ephemeral: true,
				content: `Uptime: ${(performance.now() / (86400 * 1000)).toFixed(
					2,
				)} days`,
			}).catch(logger.error);
		},
	},
	usage: {
		data: new SlashCommandBuilder()
			.setName('usage')
			.setDescription('Check the heap size and disk usage of the bot!'),
		execute: async (interaction) => {
			const heap = heapStats();
			const cacheUsage = await dirSize('cache');
			const dataUsage = await dirSize('data');
			const logUsage = await dirSize('logs');
			await interaction.reply({
				ephemeral: true,
				content: [
					`Heap size: ${(heap.heapSize / 1024 / 1024).toFixed(2)} MB / ${(heap.heapCapacity / 1024 / 1024).toFixed(2)} MB (${(heap.extraMemorySize / 1024 / 1024).toFixed(2)} MB) (${heap.objectCount.toLocaleString("en-US")} objects, ${heap.protectedObjectCount.toLocaleString("en-US")} protected-objects)`,
					`Cache usage: ${(cacheUsage / 1024 / 1024).toFixed(2)} MB`,
					`Data usage: ${(dataUsage / 1024 / 1024).toFixed(2)} MB`,
					`Logs usage: ${(logUsage / 1024 / 1024).toFixed(2)} MB`,
				].join('\n'),
			}).catch(logger.error);
		},
	},
};

export default commands;
