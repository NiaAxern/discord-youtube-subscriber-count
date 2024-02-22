/** @format */

import type {
	AutocompleteInteraction,
	CacheType,
	CommandInteraction,
	SlashCommandBuilder,
} from 'discord.js';

interface CommandType {
	data: SlashCommandBuilder;
	execute: (interaction: CommandInteraction<CacheType>) => Promise<void>;
	autoComplete?: (interaction: AutocompleteInteraction<CacheType>) => Promise<void>;
}
interface Commands {
	ping?: CommandType;
	track?: CommandType;
	[key: string]: CommandType; // Index signature
}

export { CommandType, Commands };
