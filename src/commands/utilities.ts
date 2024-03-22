/** @format */
import type { Commands } from '../types/commands';
import { heapStats } from 'bun:jsc';
import { dirSize } from '../utilities';
import logger from '../logging';
import client from '../client';
const commands: Commands = {
	ping: {
		data: {
			options: [],
			name: 'ping',
			description: 'Check the ping of the bot!',
			integration_types: [0, 1],
			contexts: [0, 1, 2],
		},
		execute: async (interaction) => {
			await interaction
				.reply({
					ephemeral: false,
					content: `Ping: ${interaction.client.ws.ping}ms`,
				})
				.catch(logger.error);
		},
	},
	help: {
		data: {
			options: [],
			name: 'help',
			description: 'Get help on what each command does!',
			integration_types: [0, 1],
			contexts: [0, 1, 2],
		},
		execute: async (interaction) => {
			await client.application?.commands?.fetch().catch(logger.error);
			const chat_commands = client.application?.commands.cache.map((a) => {
				return `</${a.name}:${a.id}>: ${a.description}`;
			});
			await interaction
				.reply({
					ephemeral: true,
					content: `Commands:\n${chat_commands?.join('\n')}`,
				})
				.catch(logger.error);
		},
	},
	termsofservice: {
		data: {
			options: [],
			name: 'termsofservice',
			description: 'Terms of Service. Read what you can and can\'t do.',
			integration_types: [0, 1],
			contexts: [0, 1, 2],
		},
		execute: async (interaction) => {
			await interaction
				.reply({
					ephemeral: true,
					content: `[Terms of Service](https://nia-statistics.com/discord-bot-tos.html)`,
				})
				.catch(logger.error);
				
		},
	},
	privacypolicy: {
		data: {
			options: [],
			name: 'privacypolicy',
			description: 'Privacy Policy. See what information is taken with this app.',
			integration_types: [0, 1],
			contexts: [0, 1, 2],
		},
		execute: async (interaction) => {
			await interaction
				.reply({
					ephemeral: true,
					content: `[Privacy Policy](https://nia-statistics.com/discord-bot-privacy-policy.html)`,
				})
				.catch(logger.error);
		},
	},
	sourcecode: {
		data: {
			options: [],
			name: 'sourcecode',
			description: 'Get the link of the app\'s source code.',
			integration_types: [0, 1],
			contexts: [0, 1, 2],
		},
		execute: async (interaction) => {
			await interaction
				.reply({
					ephemeral: true,
					content: `[Github repository](https://github.com/NiaAxern/discord-youtube-subscriber-count)`,
				})
				.catch(logger.error);
		},
	},
	uptime: {
		data: {
			options: [],
			name: 'uptime',
			description: 'Check the uptime of the bot!',
			integration_types: [0, 1],
			contexts: [0, 1, 2],
		},
		execute: async (interaction) => {
			await interaction
				.reply({
					ephemeral: false,
					content: `Uptime: ${(performance.now() / (86400 * 1000)).toFixed(
						2,
					)} days`,
				})
				.catch(logger.error);
		},
	},
	usage: {
		data: {
			options: [],
			name: 'usage',
			description: 'Check the heap size and disk usage of the bot!',
			integration_types: [0, 1],
			contexts: [0, 1, 2],
		},
		execute: async (interaction) => {
			const heap = heapStats();
			const cacheUsage = await dirSize('cache');
			const dataUsage = await dirSize('data');
			const logUsage = await dirSize('logs');
			await interaction
				.reply({
					ephemeral: false,
					content: [
						`Heap size: ${(heap.heapSize / 1024 / 1024).toFixed(2)} MB / ${(
							heap.heapCapacity /
							1024 /
							1024
						).toFixed(2)} MB (${(heap.extraMemorySize / 1024 / 1024).toFixed(
							2,
						)} MB) (${heap.objectCount.toLocaleString(
							'en-US',
						)} objects, ${heap.protectedObjectCount.toLocaleString(
							'en-US',
						)} protected-objects)`,
						`Cache usage: ${(cacheUsage / 1024 / 1024).toFixed(2)} MB`,
						`Data usage: ${(dataUsage / 1024 / 1024).toFixed(2)} MB`,
						`Logs usage: ${(logUsage / 1024 / 1024).toFixed(2)} MB`,
					].join('\n'),
				})
				.catch(logger.error);
		},
	},
};

export default commands;
