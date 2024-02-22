/** @format */

import { ChannelType, SlashCommandBuilder } from 'discord.js';

import type { Commands } from '../types/commands';

import { getChannel_Main, searchChannel } from '../innertube/functions';

import config from '../../config';
import { QuickMakeEmbed } from '../utilities';

import { cacheSystem } from '..';
import type { Channel } from '../types/channelType';
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
				interaction.options?.get('query')?.value?.toString() ??
				"(You didn't enter any channelID's";
			if (getID.length != 24 || getID.startsWith('UC') == false)
				return await interaction.editReply({
					embeds: [
						QuickMakeEmbed(
							{
								color: 'Red',
								title: 'Incorrect YouTube channel id!',
								description: `The channel id \`${getID}\` is not a valid channel id.`,
							},
							interaction,
						),
					],
				});
			if (isDM == true && config.bot.privateMessages == false)
				return await interaction.editReply({
					embeds: [
						QuickMakeEmbed(
							{
								color: 'Red',
								title:
									'Tracking channels in direct messages has been disabled.',
								description: `If you are the owner of the bot, enable it in the \`config.ts\` file.`,
							},
							interaction,
						),
					],
				});
			else if (isDM == false) {
				const hasPermissions =
					interaction.memberPermissions?.has('Administrator') ||
					interaction.memberPermissions?.has('ManageGuild') ||
					interaction.memberPermissions?.has('ManageChannels') ||
					false;
				if (hasPermissions == false)
					return await interaction.editReply({
						embeds: [
							QuickMakeEmbed(
								{
									color: 'Red',
									title: "You don't have permissions",
									description: `Here are the permissions that you need to atleast one enabled:
									**Administrator**: ${interaction.memberPermissions?.has('Administrator')}
									**ManageGuild**: ${interaction.memberPermissions?.has('ManageGuild')}
									**ManageChannels**: ${interaction.memberPermissions?.has('ManageChannels')}`,
								},
								interaction,
							),
						],
					});
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

				if (botPermissions == false)
					return await interaction.editReply({
						embeds: [
							QuickMakeEmbed(
								{
									color: 'Red',
									title: "The bot doesn't have permissions",
									description: `Here are the permissions that the bot has to have enabled:
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
								},
								interaction,
							),
						],
					});
			}
			const checkCache = await cacheSystem.get(getID).catch(() => {
				return null;
			});
			let channel: Channel =
				checkCache != null ? await JSON.parse(checkCache) : null;
			if (!checkCache) {
				channel = await getChannel_Main(getID);
			}
			if (!channel.channel_id)
				// we got this far so everything seems to be fine!
				return await interaction.editReply({
					embeds: [
						QuickMakeEmbed(
							{
								color: 'Red',
								title: 'Channel was not found.',
								description: `The channel \`${getID}\` was NOT found.`,
							},
							interaction,
						),
					],
				});

			// after everything has been successfully been done we respond with the all done message!
			let getText = interaction.client.channels.cache.get(getChannel);
			if (!getText) {
				await interaction.client.channels.fetch(getChannel);
				getText = interaction.client.channels.cache.get(getChannel);
			}
			if (!getText)
				return await interaction.editReply({
					embeds: [
						QuickMakeEmbed(
							{
								color: 'Red',
								title: 'Something went wrong.',
								description: `We can't find the discord channel <#${getID}>.\nThis should rarely happen.`,
							},
							interaction,
						),
					],
				});
			const opt = {
				embeds: [
					QuickMakeEmbed(
						{
							color: 'Green',
							title: `Channel has been successfully added for tracking in <#${getChannel}>!`,
							description: `**${channel.title}** with ${
								channel.subscribers?.toLocaleString("en-US")
							} subscribers has been tracked by <@${
								interaction.user.id
							}> to <#${getChannel}> ${
								interaction.guild?.name != null
									? `in **${interaction.guild?.name}**`
									: ''
							}`,
						},
						interaction,
					)
						.setThumbnail(channel.avatar ?? null)
						.setURL('https://www.youtube.com/channel/' + getID),
				],
			};
			if (getText.isTextBased() == true && getText.isDMBased() == false) {
				await getText.send(opt);
			}
			return await interaction.editReply(opt);
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
