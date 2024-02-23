/** @format */

// I wrote a function this like way back ago but I lost it so this is now written by bing AI.
// tbf this looks way better than my old code :)
export function formatLargeNumber(input: string) {
	if (!input || input == null) return null;
	input = input
		.replace(' subscribers', '')
		.replace(' subscriber', '')
		.replace(' subs', ''); //FIXME: better way of removing spaces
	//and subscriber(s) text from ex. 240K subscribers

	// Extract the numeric part from the input string
	const numericString: string | undefined = input.match(/\d+(\.\d+)?/)?.[0];
	if (!numericString) return null;

	// Convert the numeric string to a number
	const numericValue = parseFloat(numericString);

	// Multiply by the appropriate factor based on the suffix (e.g., "M" for million)
	const suffix = input.slice(-1).toUpperCase();
	let multiplier = 1;
	if (suffix === 'K') {
		multiplier = 1e3; // 1 million
	} else if (suffix === 'M') {
		multiplier = 1e6; // 1 million
	} else if (suffix === 'B') {
		multiplier = 1e9; // 1 billion
	} // Add more cases for other suffixes if needed

	// Calculate the final formatted value
	const formattedValue = numericValue * multiplier;

	return formattedValue;
}

import {
	EmbedBuilder,
	type CacheType,
	type CommandInteraction,
	type ColorResolvable,
	Client,
} from 'discord.js';
import { Hash, createHash } from 'node:crypto';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
/**
 * Creates hash of given files/folders. Used to conditionally deploy custom
 * resources depending if source files have changed
 */
export async function getHashOfFolder(paths: string[], inputHash?: Hash) {
	const hash = inputHash ? inputHash : createHash('sha1');
	for (const path of paths) {
		const statInfo = await stat(path);
		if (statInfo.isDirectory()) {
			const directoryEntries = await readdir(path, { withFileTypes: true });
			const fullPaths = directoryEntries.map((e) => join(path, e.name));
			// recursively walk sub-folders
			await getHashOfFolder(fullPaths, hash);
		} else {
			const statInfo = await stat(path);
			// compute hash string name:size:mtime
			const fileInfo = `${path}:${statInfo.size}:${statInfo.mtimeMs}`;
			hash.update(fileInfo);
		}
	}
	// if not being called recursively, get the digest and return it as the hash result
	if (!inputHash) {
		return hash.digest().toString('base64');
	}
	return;
}

// For quick embeds...
export function QuickMakeEmbed(
	{
		color,
		title,
		description,
	}: {
		color: ColorResolvable;
		title: string;
		description: string;
	},
	interaction?: CommandInteraction<CacheType>,
	djs_client?: Client,
) {
	return new EmbedBuilder()
		.setColor(color)
		.setTitle(title)
		.setDescription(description)
		.setTimestamp()
		.setFooter({
			text:
				interaction?.client.user.displayName ??
				djs_client?.user?.displayName ??
				'No name',
			iconURL:
				interaction?.client?.user?.avatarURL() ??
				djs_client?.user?.avatarURL() ??
				'https://cdn.discordapp.com/embed/avatars/0.png',
		});
}

// for /usage
import path from 'path';
export const dirSize = async (directory: string) => {
	const files = await readdir(directory);
	const stats = files.map((file) => stat(path.join(directory, file)));
	return (await Promise.all(stats)).reduce(
		(accumulator, { size }) => accumulator + size,
		0,
	);
};

export const isValidUrl = (urlString: string) => {
	try {
		return Boolean(new URL(urlString));
	} catch (e) {
		return false;
	}
};

export const howLong = (interval: number) => {
	const days = Math.floor(interval / (86400 * 1000));
	const hours = Math.floor(interval / (3600 * 1000)) % 24;
	const minutes = Math.floor(interval / (60 * 1000)) % 60;
	const seconds = Math.floor(interval / 1000) % 60;
	return [
		[days, 'd'],
		[hours, 'h'],
		[minutes, 'm'],
		[seconds, 's'],
	]
		.filter((a) => parseInt(`${a[0]}`) > 0) // thanks typescript
		.map((a) => a.join(''))
		.join(', ');
};
