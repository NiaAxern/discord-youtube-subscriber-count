/** @format */

import type {
	CacheType,
	CommandInteraction,
	SlashCommandBuilder,
} from 'discord.js';

interface CommandType {
	data: SlashCommandBuilder;
	execute: (interaction: CommandInteraction<CacheType>) => Promise<void>;
}
interface Commands {
	ping?: CommandType;
	[key: string]: CommandType; // Index signature
}

export { CommandType, Commands };
