/** @format */
import './client';

import { getHashOfFolder } from './utilities';
import fs from 'fs/promises';
import logger from './logging';
const getDir = (await fs.readdir('src/commands')).map((value) => {
	return 'src/commands/' + value;
});
const hash = await getHashOfFolder(getDir);
if (!hash)
	throw 'There is no hash for the commands folder. Something very much went wrong in the code.';
logger.debug('This is the hash: ' + hash);
logger.debug('Checking cached hash...');
try {
	await fs.readdir('cache');
} catch {
	await fs.mkdir('cache');
}
const getHash = (
	await fs.readFile('cache/hash').catch((e) => {
		return e?.eeee ?? undefined ?? null;
	})
)?.toString();
let triggerUpdate = false;
if (getHash != hash) {
	triggerUpdate = true;
	await fs.writeFile('cache/hash', hash);
}
import commands from './commands';
import { REST, Routes } from 'discord.js';
import type { CommandType } from './types/commands';
if(triggerUpdate == false) logger.debug('Hash hasn\'t changed.');
if (triggerUpdate == true) {
	try {
		if (!process.env.DISCORD_TOKEN)
			throw "No token provided. Add the bot's DISCORD_TOKEN to the .env.local file.";
		const rest = new REST().setToken(process.env.DISCORD_TOKEN);
		logger.debug(
			`Started refreshing ${commands.size} application (/) commands.`,
		);
		// FIXME: not to use 'any'. also this workaround for eslint is dumb.
		const getID: any /*eslint-disable-line*/ = (await rest.get(Routes.currentApplication())) || {
			id: null,
		};
		if (!getID?.id) throw 'No application was found with this token.';
		// FIXME: not to use 'any' 2.
		const data: any /*eslint-disable-line*/ = await rest.put(Routes.applicationCommands(getID.id), {
			body: [...commands.values()].map((a: CommandType) => {
				return a.data.toJSON();
			}),
		});

		logger.debug(
			`Successfully reloaded ${data.length} application (/) commands.`,
		);
	} catch (error) {
		logger.error(error);
	}
}
