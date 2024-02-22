/** @format */

import fs from 'fs/promises';
import logger from './logging';
// save the commands to a map
const commands = new Map();
const getDir = (await fs.readdir('src/commands')).map((value) => {
	return './commands/' + value;
});
for await (const filepath of getDir) {
	const Commands = (await import(filepath)).default;
	logger.debug("loading commands from "+filepath);
	for (const key in Commands) {
		const command = Commands[key];
		logger.debug("loading "+key);
		commands.set(key, command);
	}
}
export default commands;
