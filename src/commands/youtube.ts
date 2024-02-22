/** @format */

import { ChannelType, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import type { Commands } from '../types/commands';

import { searchChannel } from '../innertube/functions';

import config from '../../config';

const commands: Commands = {
	track: {
		data: new SlashCommandBuilder()
			.setName('track')
			// typescript starts crying when the addOptions are on the bottom
			// so to fix it i made description be the bottom and it fixed it.
			// What. FIXME: this ^
			.addStringOption((option) =>
				option
					.setName('query')
					.setDescription('Query to search with.')
					.setRequired(false)
					.setAutocomplete(true),
			)
			.addChannelOption((option) =>
				option
					.setName('text_channel')
					.setDescription('The channel to send the notifications to.')
					.setRequired(false)
					.addChannelTypes(ChannelType.GuildAnnouncement)
					.addChannelTypes(ChannelType.GuildText)
					.addChannelTypes(ChannelType.PublicThread),
			)
			.setDescription(
				'Track a channel and their subscribers here or a different channel.',
			),
		execute: async (interaction) => {
			await interaction.deferReply({ ephemeral: true });
			const isDM = interaction.inGuild() == false;
			const getChannel =
				interaction.options?.get('text_channel')?.channel?.id ??
				interaction.channelId;
			const getID: string =
				interaction.options?.get('query')?.value?.toString() ?? '';
			if (getID.length != 24 || getID.startsWith('UC') == false) {
				await interaction.editReply({
					embeds: [
						new EmbedBuilder()
							.setColor('Red')
							.setTitle('Incorrect YouTube channel id!')
							.setDescription(
								`The channel id \`${getID}\` is not a valid channel id.`,
							)
							.setTimestamp()
							.setFooter({
								text: interaction.client.user.displayName,
								iconURL:
									interaction.client.user?.avatarURL() ??
									'https://cdn.discordapp.com/embed/avatars/0.png',
							}),
					],
				});
				return;
			}
			if (getID)
				if (isDM == true) {
					if (config.bot.privateMessages == false) {
						await interaction.editReply({
							embeds: [
								new EmbedBuilder()
									.setColor('Red')
									.setTitle(
										'Tracking channels in direct messages has been disabled.',
									)
									.setDescription(
										`If you are the owner of the bot, enable it in the \`config.ts\` file.`,
									)
									.setTimestamp()
									.setFooter({
										text: interaction.client.user.displayName,
										iconURL:
											interaction.client.user?.avatarURL() ??
											'https://cdn.discordapp.com/embed/avatars/0.png',
									}),
							],
						});
						return;
					} else {
						await interaction.editReply({
							content: `WIP2.`,
						});
					}
				} else {
					const hasPermissions =
						interaction.memberPermissions?.has('Administrator') ||
						interaction.memberPermissions?.has('ManageGuild') ||
						interaction.memberPermissions?.has('ManageChannels') ||
						false;
					if (hasPermissions == false) {
						await interaction.editReply({
							embeds: [
								new EmbedBuilder()
									.setColor('Red')
									.setTitle("You don't have permissions")
									.setDescription(
										`Here are the permissions that you need to atleast one enabled:
									**Administrator**: ${interaction.memberPermissions?.has('Administrator')}
									**ManageGuild**: ${interaction.memberPermissions?.has('ManageGuild')}
									**ManageChannels**: ${interaction.memberPermissions?.has('ManageChannels')}`,
									)
									.setTimestamp()
									.setFooter({
										text: interaction.client.user.displayName,
										iconURL:
											interaction.client.user?.avatarURL() ??
											'https://cdn.discordapp.com/embed/avatars/0.png',
									}),
							],
						});
						return;
					}
					const botPermissions =
						(interaction.channel
							?.permissionsFor(interaction.client.user)
							?.has('SendMessages') &&
							interaction.channel
								?.permissionsFor(interaction.client.user)
								?.has('EmbedLinks') &&
							interaction.channel
								?.permissionsFor(interaction.client.user)
								?.has('AddReactions') &&
							interaction.channel
								?.permissionsFor(interaction.client.user)
								?.has('AttachFiles') &&
							interaction.channel
								?.permissionsFor(interaction.client.user)
								?.has('SendMessagesInThreads')) ||
						false;

					if (botPermissions == false) {
						await interaction.editReply({
							embeds: [
								new EmbedBuilder()
									.setColor('Red')
									.setTitle("The bot doesn't have permissions")
									.setDescription(
										`Here are the permissions that the bot has to have enabled:
									**SendMessages**: ${interaction.channel
										?.permissionsFor(interaction.client.user)
										?.has('SendMessages')}
									**EmbedLinks**: ${interaction.channel
										?.permissionsFor(interaction.client.user)
										?.has('EmbedLinks')}
									**AddReactions**: ${interaction.channel
										?.permissionsFor(interaction.client.user)
										?.has('AddReactions')}
									**AttachFiles**: ${interaction.channel
										?.permissionsFor(interaction.client.user)
										?.has('AttachFiles')}
									**SendMessagesInThreads**: ${interaction.channel
										?.permissionsFor(interaction.client.user)
										?.has('SendMessagesInThreads')}`,
									)
									.setTimestamp()
									.setFooter({
										text: interaction.client.user.displayName,
										iconURL:
											interaction.client.user?.avatarURL() ??
											'https://cdn.discordapp.com/embed/avatars/0.png',
									}),
							],
						});
						return;
					}
					await interaction.editReply({
						content: `<@${interaction.user.id}> <#${getChannel}> ytchannel ${getID} in ${interaction.guild?.name}`,
					});
				}
		},
		autoComplete: async (interaction) => {
			const userQuery = interaction.options?.getString('query');
			if (userQuery == '' || !userQuery) return await interaction.respond([]);
			if (userQuery.length == 24 && userQuery.startsWith('UC'))
				return await interaction.respond([
					{
						name: `${userQuery} (using channel id)`,
						value: userQuery,
					},
				]);
			const queryYouTube = await searchChannel(userQuery);
			return await interaction.respond(
				queryYouTube.map((channel) => {
					return {
						// What is shown to the user
						name: `${channel.title} (${channel.handle}): ${
							!channel?.subscribers
								? 'No'
								: channel.subscribers?.toLocaleString('en-US')
						} subscriber${channel.subscribers == 1 ? '' : 's'}`,
						// What is actually used as the option.
						value: channel.channel_id,
					};
				}),
			);
		},
	},
};

export default commands;
