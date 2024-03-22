/** @format */

import "./validators/env"
import "./validators/config"
import { getHashOfFolder } from './utilities';
import fs from 'fs/promises';
import logger from './logging';
const getDir = (await fs.readdir('src/commands')).map((value) => {
	return 'src/commands/' + value;
});
const hash = await getHashOfFolder(getDir);
if (!hash)
	throw 'There is no hash for the commands folder. Something very much went wrong in the code.';
console.log('This is the hash: ' + hash);
console.log('Checking cached hash...');
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
}
import commands from './commands';
import { REST, Routes } from 'discord.js';
import type { CommandType } from './types/commands';
if (triggerUpdate == false) console.log("Hash hasn't changed.");
if (triggerUpdate == true) {
	try {
		if (!process.env.DISCORD_TOKEN)
			throw "No token provided. Add the bot's DISCORD_TOKEN to the .env.local file.";
		const rest = new REST().setToken(process.env.DISCORD_TOKEN);
		console.log(
			`Started refreshing ${commands.size} application (/) commands.`,
		);
		// FIXME: not to use 'any'. also this workaround for eslint is dumb.
		const getID: any /*eslint-disable-line*/ = (await rest.get(
			Routes.currentApplication(),
		)) || {
			id: null,
		};
		if (!getID?.id) throw 'No application was found with this token.';
		console.log('Now sending ' + commands.size + ' commands to Discord.');
		// FIXME: look at the above fixme
		const data: any /*eslint-disable-line*/ = await rest.put(
			Routes.applicationCommands(getID.id),
			{
				body: [...commands.values()].map((a: CommandType) => {
					return a.data;
				}),
			},
		);

		console.log(
			`Successfully reloaded ${data.length} application (/) commands.`,
		);
		await fs.writeFile('cache/hash', hash);
	} catch (error) {
		console.error(error);
	}
}

console.log('Getting meta.json');
import { getGlobalTrackCount } from './database';
console.log(
	'There are ' + getGlobalTrackCount().toLocaleString() + ' trackings',
);
console.log('Testing cache...');
import Cache from './cache';
const cacheSystem = new Cache(); // use default
await cacheSystem.set('test', 'true');
console.log(await cacheSystem.get('test'));
console.log('everything seems to be working fine now.');
console.log('Initialize client and start the bot as there are no errors.');
import './client';
export { cacheSystem };
