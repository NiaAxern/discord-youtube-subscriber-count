/** @format */

import djs_client from './client';
import { youtube_channels, subscribes } from './database';
import config from '../config';
import { getChannels } from './youtube-data-api-v3/functions';
import { getChannel_Main } from './innertube/functions';
import type { updateRecord } from './types/channelType';
import { cacheSystem } from '.';
import { QuickMakeEmbed, howLong } from './utilities';
import logger from './logging';
import fs from 'fs/promises';
let updatePossible = true;
let lastTrackTime = 0;
let dirExists = false;
async function checkForUpdates() {
	if (updatePossible == false) return;
	try {
		lastTrackTime = performance.now();
		updatePossible = false;
		let fetchingIDs = [];
		let index = -1;
		for await (const saved_channel of youtube_channels) {
			try {
				index++;
				fetchingIDs.push([saved_channel.channel_id, index]);
				if (
					fetchingIDs.length >=
					(config.youtube.api != 'innertube'
						? index == youtube_channels.length - 1
							? fetchingIDs.length
							: 50
						: 1)
				) {
					const ytIDs = fetchingIDs;
					fetchingIDs = [];
					const response =
						config.youtube.api != 'innertube'
							? await getChannels(ytIDs.map((a) => a[0]).join(','))
							: [await getChannel_Main(ytIDs.map((a) => a[0]).join(','))];

					for (const channel of response) {
						try {
							const _index = parseInt(
								//TODO: make it cleaner
								`${ytIDs.find((c) => c[0] == channel.channel_id)?.[1]}`,
							);
							const getUser = youtube_channels?.[_index];
							if (
								_index == null ||
								_index == undefined ||
								!getUser ||
								!channel?.subscribers
							)
								continue;
							// check if new subscribercount is different to the old one
							const needUpdate =
								channel.subscribers != getUser.currentUpdate?.subscribers;
							if (needUpdate == false) continue;
							// Update needed so...
							const currentDate = new Date();
							const lastDate = new Date(getUser.currentUpdate?.hit ?? 0);
							const timeTook = !getUser.currentUpdate?.hit
								? 0
								: currentDate.getTime() - lastDate.getTime();
							const subscriberDifference = !getUser.currentUpdate?.subscribers
								? 0
								: channel.subscribers - getUser.currentUpdate?.subscribers;
							const newRecord: updateRecord = {
								subscribers: channel.subscribers,
								hit: currentDate.toISOString(),
								timeTook: timeTook,
								sub_rate: subscriberDifference / timeTook,
							};
							getUser.lastUpdate = getUser.currentUpdate; // haha
							getUser.currentUpdate = newRecord;
							await cacheSystem.set(
								channel.channel_id,
								JSON.stringify(channel),
							); // save it to the cache!
							if (dirExists == false) {
								const checkIfExists = await fs.readdir('data');
								if (checkIfExists.findIndex((a) => a == 'history') == -1) {
									logger.debug('making history dir to data dir');
									await fs.mkdir('data/history');
								} else {
									logger.debug(
										'history dir in data dir already exists. doing nothing now...',
									);
								}
								dirExists = true;
							}
							await fs
								.appendFile(
									'data/history/' + getUser.channel_id + '.csv',
									`\n${getUser.currentUpdate.hit},${channel.subscribers},${channel.views},${channel.videos}`,
								)
								.catch(logger.error);
							// send to the subscribers
							for (const subscriberID of getUser.subscriberIDs) {
								try {
									const getTextChannel = subscribes.find(
										(subscriberRecord) =>
											subscriberRecord.subscriberID == subscriberID,
									);
									if (!getTextChannel?.discord_channel) continue;
									if (
										!djs_client.channels.cache?.get(
											getTextChannel.discord_channel,
										)
									)
										await djs_client.channels
											.fetch(getTextChannel.discord_channel)
											.catch(logger.error);
									const DiscordChannel = djs_client.channels.cache?.get(
										getTextChannel.discord_channel,
									);
									if (DiscordChannel?.isTextBased())
										DiscordChannel.send({
											embeds: [
												QuickMakeEmbed(
													{
														color:
															getUser.lastUpdate?.subscribers == null
																? 'Blurple'
																: newRecord.sub_rate == 0
																? 'Yellow'
																: newRecord.sub_rate > 0
																? 'Green'
																: 'Red',
														title: `${
															getUser.lastUpdate?.subscribers == null
																? 'First subscriber'
																: 'Subscriber'
														} count update for ${channel.title}`.slice(0, 255),
														description: `${getUser.subscriberIDs.length.toLocaleString(
															'en-US',
														)} channel${
															getUser.subscriberIDs.length == 1
																? ' was'
																: 's were'
														} notified of this`,
													},
													undefined,
													djs_client,
												)
													.addFields({
														name: 'Old Subscriber Count',
														value: `${
															getUser.lastUpdate?.subscribers?.toLocaleString(
																'en-US',
															) || 'None'
														} _ _`,
														inline: true,
													})
													.addFields({
														name: 'New Subscriber Count',
														value: `${
															getUser.currentUpdate?.subscribers?.toLocaleString(
																'en-US',
															) ?? 'None'
														} _ _`,
														inline: true,
													})
													.addFields({
														name: 'Average subs / day',
														value: `${
															Math.floor(
																getUser.currentUpdate.sub_rate *
																	(86400 * 1000) || 0,
															).toLocaleString('en-US') ?? 'None'
														} (${
															(getUser.currentUpdate?.sub_rate ?? 0) -
																(getUser.lastUpdate?.sub_rate ?? 0) >=
															0
																? '+'
																: ''
														}${
															Math.floor(
																((getUser.currentUpdate?.sub_rate ?? 0) -
																	(getUser.lastUpdate?.sub_rate ?? 0)) *
																	(86400 * 1000) || 0,
															).toLocaleString('en-US') ?? 'None'
														}) _ _`,
														inline: true,
													})
													.addFields({
														name: `${
															getUser.lastUpdate?.subscribers?.toLocaleString(
																'en-US',
															) ?? 'None'
														}`,
														value: `<t:${Math.floor(
															lastDate.getTime() / 1000,
														)}:R> <t:${Math.floor(
															lastDate.getTime() / 1000,
														)}:T> _ _`,
														inline: true,
													})
													.addFields({
														name: `${getUser.currentUpdate?.subscribers?.toLocaleString(
															'en-US',
														)}`,
														value: `<t:${Math.floor(
															currentDate.getTime() / 1000,
														)}:R> <t:${Math.floor(
															currentDate.getTime() / 1000,
														)}:T> _ _`,
														inline: true,
													})
													.addFields({
														name: 'How long',
														value: `${howLong(timeTook)} _ _`,
														inline: true,
													})
													.setURL(
														'https://www.youtube.com/channel/' +
															channel.channel_id,
													)
													.setAuthor({
														iconURL:
															channel?.avatar ||
															'https://cdn.discordapp.com/embed/avatars/0.png',
														name: `${
															channel?.handle ??
															channel.title ??
															channel.channel_id
														}`.slice(0, 50),
													}),
											],
										}).catch(logger.error);
								} catch (e) {
									logger.error(e);
								}
							}
						} catch (e) {
							logger.error(e);
						}
					}
				}
			} catch (e) {
				logger.error(e);
			}
		}
	} catch (e) {
		logger.error(e);
	} finally {
		await Bun.sleep(config.youtube.delay);
		updatePossible = true; // allow saving again
	}
}
setInterval(checkForUpdates, 1000); // save it every second, it will not save if something is already saving it.
setInterval(() => {
	if (
		performance.now() - lastTrackTime >
			60_000 * 5 + (config.youtube.delay ?? 0) &&
		updatePossible == false
	) {
		updatePossible = true; // force save if it gets stuck
		logger.debug(
			'tracking was locked for ' +
				Math.floor(performance.now() - lastTrackTime) +
				'ms, so we forced it to work again. this should rarely happen though...',
		);
	}
}, 10000);
