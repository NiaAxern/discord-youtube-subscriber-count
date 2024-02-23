/** @format */

import type { Channel } from '../types/channelType';

import { isValidUrl } from '../utilities';

async function getChannels(channel_ids: string): Promise<Channel[]> {
	// TODO: maybe typing these?
	const data: any /* eslint-disable-line */ = await fetch(
		isValidUrl(process.env?.SELF_HOSTED_YT_API ?? '')
			? process.env.SELF_HOSTED_YT_API + channel_ids
			: `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channel_ids}&key=${process.env.YT_API_KEY}`,
	).then((resp) => resp.json());
	return (data?.items ?? []).map(
		(channelResponse: any /* eslint-disable-line */) => {
			// FIXME: add typings
			return {
				avatar: Object.values(Object.values(channelResponse.snippet.thumbnails))
					.sort((a: any, b: any /*eslint-disable-line*/) => b.width - a.width)
					.map((a: any /*eslint-disable-line*/) => a.url)[0],
				title: channelResponse.snippet.title,
				handle: channelResponse.snippet.customUrl,
				channel_id: channelResponse.id,
				subscribers: parseInt(channelResponse.statistics.subscriberCount),
				views: parseInt(channelResponse.statistics.viewCount),
				videos: parseInt(channelResponse.statistics.videoCount),
			};
		},
	);
}
export { getChannels };
