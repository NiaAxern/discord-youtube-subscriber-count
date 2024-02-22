/** @format */

export default {
	http: {
		// TODO: http support
		enabled: false, // true or false.
		port: null, // Any port between 1-65535 or null to make it random.
	},
	bot: {
		privateMessages: true, // allow tracking to be done in private messages
	},
	youtube: {
		api: 'data-api-v3', // data-api-v3 or innertube
		'data-api-v3': {
			// RECOMMENDED
			key: null,
		},
		innertube: {
			// This is good for few-channel-bots because innertube can only do 1 channel per request
			// while data-api-v3 can do max 50 per request.
			// not recommended, will break whenever.

            // There is no configurations. Just switch the 'api' value to 'innertube' and this should ~work~.
		},
		delay: 1000, // Delay between trackings.
		//Increase this to use less quota (if using data-api-v3)
	},
};
