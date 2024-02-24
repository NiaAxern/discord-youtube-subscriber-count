/** @format */

export default {
	http: {
		// TODO: http support
		enabled: false, // true or false.
		port: null, // Any port between 1-65535 or null to make it random.
	},
	bot: {
		throttle: { // TODO: add this to v1.1.0 
			ms: 10000, // waits for that many seconds before it sends the api message so that it doesn't start spamming
			max: null, // max subscribers to have throttle on (null == no limit)
			min: null // min subscribers to have throttle on (null == no limit)
		},
		graphs: true, // TODO: add this to v1.1.0
		privateMessages: true, // allow tracking to be done in private messages
	},
	youtube: {
		api: 'data-api-v3', // data-api-v3 or innertube
		delay: 1000, // Delay between trackings.
		//Increase this to use less quota (if using data-api-v3)
	},
};
