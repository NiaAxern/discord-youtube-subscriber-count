/** @format */

import pino from 'pino';
const logger = pino({
	transport: {
		targets: [
			{
				level:
					process.argv.findIndex((val) => val == '--dev') != -1
						? 'trace'
						: 'info',
				target: 'pino-pretty',
				options: {
					colorize: true,
				},
			},
			{
				level: 'trace',
				target: 'pino/file',
				options: { destination: './pino-logger.log' },
			},
		],
	},
	timestamp: pino.stdTimeFunctions.isoTime,
	level:
		process.argv.findIndex((val) => val == '--dev') != -1 ? 'trace' : 'info',
});

export default logger;
