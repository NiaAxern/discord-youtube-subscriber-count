/** @format */

import type { Channel } from '../types/channelType';

import { formatLargeNumber } from '../utilities';

async function getChannel_About(channel_id: string): Promise<Channel> {
	// TODO: maybe typing these?
	const data: any = await fetch( // eslint-disable-line
		'https://www.youtube.com/youtubei/v1/browse?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8&prettyPrint=false',
		{
			headers: {
				// TODO: Save this to a different file so we can reuse these and change super easily.
				accept: '*/*',
				'accept-language': 'en-US,en;q=0.9',
				'content-type': 'application/json',
				'sec-ch-ua':
					'"Not A(Brand";v="99", "Chromium";v="121", "Google Chrome";v="121"',
				'sec-ch-ua-arch': '"x86"',
				'sec-ch-ua-bitness': '"64"',
				'sec-ch-ua-full-version': '"121.0.6167.184"',
				'sec-ch-ua-full-version-list':
					'"Not A(Brand";v="99.0.0.0", "Chromium";v="121.0.6167.184", "Google Chrome";v="121.0.6167.184"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-model': '""',
				'sec-ch-ua-platform': '"Windows"',
				'sec-ch-ua-platform-version': '"15.0.0"',
				'sec-ch-ua-wow64': '?0',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'same-origin',
				'sec-fetch-site': 'same-origin',
				'x-youtube-bootstrap-logged-in': 'false',
				'x-youtube-client-name': '1',
				'x-youtube-client-version': '2.20240216.03.00',
			},
			body: JSON.stringify({
				context: {
					client: {
						hl: 'en',
						gl: 'FI',
						remoteHost: '',
						deviceMake: '',
						deviceModel: '',
						visitorData: '',
						userAgent: '',
						clientName: 'WEB',
						clientVersion: '2.20240216.03.00',
						osName: 'Windows',
						osVersion: '10.0',
						originalUrl: 'https://www.youtube.com/',
						platform: 'DESKTOP',
						clientFormFactor: 'UNKNOWN_FORM_FACTOR',
						configInfo: {
							appInstallData: '',
						},
						userInterfaceTheme: 'USER_INTERFACE_THEME_DARK',
						timeZone: '',
						browserName: '',
						browserVersion: '',
						acceptHeader: '',
						deviceExperimentId: '',
						screenWidthPoints: 1,
						screenHeightPoints: 1,
						screenPixelDensity: 0,
						screenDensityFloat: 0,
						utcOffsetMinutes: 0,
						connectionType: 'CONN_CELLULAR_2G',
						memoryTotalKbytes: '8',
						mainAppWebInfo: {
							graftUrl: '',
							pwaInstallabilityStatus: 'PWA_INSTALLABILITY_STATUS_UNKNOWN',
							webDisplayMode: 'WEB_DISPLAY_MODE_BROWSER',
							isWebNativeShareAvailable: true,
						},
					},
					user: {
						lockedSafetyMode: false,
					},
					request: {
						useSsl: true,
						internalExperimentFlags: [],
						consistencyTokenJars: [],
					},
					clickTracking: {
						clickTrackingParams: '',
					},
					adSignalsInfo: {
						params: [],
					},
				},
				continuation: btoa(
					// TODO: update this to a newer b64 function as this is "deprecated"
					'â©\x85²\x02`\x12\x18' +
						channel_id + // magic
						'\x1AD8gYrGimaASYKJDY2NGRhYzIwLTAwMDAtMjU2OS05Mjk2LWY0ZjVlODA5NzBhMA%3D%3D',
				),
			}),
			method: 'POST',
		},
	).then((resp) => resp.json());
	let handle =
		data.onResponseReceivedEndpoints[0].appendContinuationItemsAction
			.continuationItems[0].aboutChannelRenderer.metadata.aboutChannelViewModel
			.canonicalChannelUrl;
	if (handle.includes('@') == false) handle = undefined;
	else handle = handle.split('youtube.com/')[1];
	return {
		avatar: undefined,
		title: undefined,
		handle: handle,
		channel_id:
			data.onResponseReceivedEndpoints[0].appendContinuationItemsAction
				.continuationItems[0].aboutChannelRenderer.metadata
				.aboutChannelViewModel.channelId,
		subscribers: formatLargeNumber(
			data.onResponseReceivedEndpoints[0].appendContinuationItemsAction
				.continuationItems[0].aboutChannelRenderer.metadata
				.aboutChannelViewModel.subscriberCountText,
		),
		// this is so dumb like why is the sub count the only thing abbreviated?
		views: parseInt(
			data.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems[0].aboutChannelRenderer.metadata.aboutChannelViewModel.viewCountText.replace(
				/\D/g,
				'',
			),
		),
		videos: parseInt(
			data.onResponseReceivedEndpoints[0].appendContinuationItemsAction.continuationItems[0].aboutChannelRenderer.metadata.aboutChannelViewModel.videoCountText.replace(
				/\D/g,
				'',
			),
		),
	};
}
async function getChannel_Main(channel_id: string): Promise<Channel> {
	// TODO: same here, maybe typing these someday?
	const data: any = await fetch( // eslint-disable-line
		'https://www.youtube.com/youtubei/v1/browse?key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8&prettyPrint=false',
		{
			headers: {
				// TODO: Save this to a different file so we can reuse these and change super easily.
				accept: '*/*',
				'accept-language': 'en-US,en;q=0.9',
				'content-type': 'application/json',
				'sec-ch-ua':
					'"Not A(Brand";v="99", "Chromium";v="121", "Google Chrome";v="121"',
				'sec-ch-ua-arch': '"x86"',
				'sec-ch-ua-bitness': '"64"',
				'sec-ch-ua-full-version': '"121.0.6167.184"',
				'sec-ch-ua-full-version-list':
					'"Not A(Brand";v="99.0.0.0", "Chromium";v="121.0.6167.184", "Google Chrome";v="121.0.6167.184"',
				'sec-ch-ua-mobile': '?0',
				'sec-ch-ua-model': '""',
				'sec-ch-ua-platform': '"Windows"',
				'sec-ch-ua-platform-version': '"15.0.0"',
				'sec-ch-ua-wow64': '?0',
				'sec-fetch-dest': 'empty',
				'sec-fetch-mode': 'same-origin',
				'sec-fetch-site': 'same-origin',
				'x-youtube-bootstrap-logged-in': 'false',
				'x-youtube-client-name': '1',
				'x-youtube-client-version': '2.20240216.03.00',
			},
			body: JSON.stringify({
				context: {
					client: {
						hl: 'en',
						gl: 'FI',
						remoteHost: '',
						deviceMake: '',
						deviceModel: '',
						visitorData: '',
						userAgent: '',
						clientName: 'WEB',
						clientVersion: '2.20240216.03.00',
						osName: 'Windows',
						osVersion: '10.0',
						originalUrl: 'https://www.youtube.com/',
						platform: 'DESKTOP',
						clientFormFactor: 'UNKNOWN_FORM_FACTOR',
						configInfo: {
							appInstallData: '',
						},
						userInterfaceTheme: 'USER_INTERFACE_THEME_DARK',
						timeZone: '',
						browserName: '',
						browserVersion: '',
						acceptHeader: '',
						deviceExperimentId: '',
						screenWidthPoints: 1,
						screenHeightPoints: 1,
						screenPixelDensity: 0,
						screenDensityFloat: 0,
						utcOffsetMinutes: 0,
						connectionType: 'CONN_CELLULAR_2G',
						memoryTotalKbytes: '8',
						mainAppWebInfo: {
							graftUrl: '',
							pwaInstallabilityStatus: 'PWA_INSTALLABILITY_STATUS_UNKNOWN',
							webDisplayMode: 'WEB_DISPLAY_MODE_BROWSER',
							isWebNativeShareAvailable: true,
						},
					},
					user: {
						lockedSafetyMode: false,
					},
					request: {
						useSsl: true,
						internalExperimentFlags: [],
						consistencyTokenJars: [],
					},
					clickTracking: {
						clickTrackingParams: '',
					},
					adSignalsInfo: {
						params: [],
					},
				},
				browseId: channel_id,
			}),
			method: 'POST',
		},
	).then((resp) => resp.json());
	return {
		avatar: data.metadata.channelMetadataRenderer.avatar.thumbnails[0].url,
		title: data.metadata.channelMetadataRenderer.title,
		handle: data.header.c4TabbedHeaderRenderer.channelHandleText.runs[0].text,
		channel_id: data.metadata.channelMetadataRenderer.externalId,
		subscribers: formatLargeNumber(
			data.header.c4TabbedHeaderRenderer.subscriberCountText.simpleText,
		),
		views: undefined,
		videos: formatLargeNumber(
			data.header.c4TabbedHeaderRenderer.videosCountText.runs[0].text,
		),
	};
}

export default {
	getChannel_About,
	getChannel_Main,
};
