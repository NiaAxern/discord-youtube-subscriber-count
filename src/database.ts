/** @format */

import fs from 'fs/promises';
import logger from './logging';
import { compress, uncompress } from 'snappy';
import type { Metafile } from './types/channelType';
logger.debug('checking for data directory');
await fs.readdir('data').catch(async (e) => {
	logger.debug(
		"There wasnt a data dir so we're making it now. The original error: " + e,
	);
	await fs.mkdir('data');
	logger.debug('Data directory has been made.');
});
logger.debug('checking for data/meta.json');
await fs.stat('data/meta.json').catch(async (e) => {
	logger.debug(
		"There wasnt a data/meta.json file so we're making it now. The original error: " +
			e,
	);
	await fs.writeFile(
		'data/meta.json',
		await compress(
			JSON.stringify({
				youtube_channels: [],
				subscribes: [],
			}),
		),
	);
	logger.debug('data/meta.json file has been made.');
});

const metaFile = Bun.file('data/meta.json');
const { youtube_channels, subscribes }: Metafile = await JSON.parse(
	(await uncompress(Buffer.from(await metaFile.arrayBuffer()))).toString(),
);

function getYTChannel(id: string) {
	return youtube_channels.find((record) => record.channel_id == id);
}
function getYTChannelSubscribers(id: string) {
	const getChannel = getYTChannel(id);
	if (!getChannel) return null;
	return getChannel.subscribers.map((id: string) => {
		const getRecord = getSubscriber(id);
		return getRecord;
	});
}
function getSubscriber(subscriberID: string) {
	return subscribes.find((record) => record.subscriberID == subscriberID);
}
function getTrackCount(_id: string, isGuild: boolean) {
	return subscribes.filter((rec) =>
		isGuild == true ? rec.guild_id == _id : rec.user_id == _id,
	).length;
}
function getTrackCountTextChannel(_id: string) {
	return subscribes.filter((rec) => rec.discord_channel == _id).length;
}
function getGlobalTrackCount() {
	return subscribes.length;
}
let updatePossible = true;
let lastSaveTime = 0;
async function refreshFile() {
	if (updatePossible == false) return;
	try {
		const start = performance.now();
		lastSaveTime = start;
		updatePossible = false;
		logger.debug('saving meta file');
		const data = await compress(
			JSON.stringify({ youtube_channels, subscribes }),
		);
		await Bun.write('data/meta_temporary.json', data);
		await fs.rename('data/meta_temporary.json', 'data/meta.json'); // so that it doesnt corrupt when power goes out or the app crashes
		logger.debug(
			'saved meta file. it took ' +
				Math.floor(performance.now() - start).toLocaleString() +
				'ms',
		);
	} catch (e) {
		logger.error(e);
	} finally {
		updatePossible = true; // allow saving again
	}
}
setInterval(refreshFile, 1000); // save it every second, it will not save if something is already saving it.
setInterval(() => {
	if (
		performance.now() - lastSaveTime > 60_000 * 5 &&
		updatePossible == false
	) {
		updatePossible = true; // force save if it gets stuck
		logger.debug(
			'saving was locked for ' +
				Math.floor(performance.now() - lastSaveTime) +
				'ms, so we forced it to work again. this should rarely happen though...',
		);
	}
}, 10000);

export {
	getYTChannel,
	getYTChannelSubscribers,
	getSubscriber,
	getTrackCount,
	getTrackCountTextChannel,
	getGlobalTrackCount,
};
