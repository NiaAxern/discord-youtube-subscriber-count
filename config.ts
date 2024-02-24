/** @format */

export default {
	http: {
		// TODO: http support
		enabled: false, // true or false.
		port: null, // Any port between 1-65535 or null to make it random.
	},
	bot: {
		privateMessages: true, // allow tracking to be done in private messages
		graph: true, // allow users to generate graphs of channels
		disableLimits: false,
		textchannelmax: 50,
		guildmax: 100,
	},
	youtube: {
		api: 'data-api-v3', // data-api-v3 or innertube
		delay: 1000, // Delay between trackings.
		//Increase this to use less quota (if using data-api-v3)
	},
};
