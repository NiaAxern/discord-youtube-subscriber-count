/** @format */

import UtilityCommands from './commands/utilities';
// save the commands to a map
const commands = new Map();
for (const key in UtilityCommands) {
	const command = UtilityCommands[key];
	commands.set(key, command);
}
export default commands;
