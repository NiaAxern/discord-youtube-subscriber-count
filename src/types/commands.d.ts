/** @format */

import type {
	AutocompleteInteraction,
	CacheType,
	CommandInteraction,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord.js';
type RESTAPIType = RESTPostAPIChatInputApplicationCommandsJSONBody & {
	integration_types: number[];
	contexts: number[];
};
interface CommandType {
	data: RESTAPIType;
	// its any because we don't need anything back from the executes and using return await interaction ... is cleaner than await interaction ... \n return
	execute: (interaction: CommandInteraction<CacheType>) => Promise<any>; // eslint-disable-line
	autoComplete?: (
		interaction: AutocompleteInteraction<CacheType>,
	) => Promise<any>; // eslint-disable-line
}
interface Commands {
	ping?: CommandType;
	track?: CommandType;
	[key: string]: CommandType; // Index signature
}

export { CommandType, Commands };
