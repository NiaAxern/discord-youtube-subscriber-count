/** @format */

interface Channel { // everything is kinda optional since we'll be using this interface for everything channel related.
	avatar?: string;
	title?: string;
	handle?: string;
	channel_id: string;
	subscribers?: number|null;
	views?: number|null;
	videos?: number|null;
}

export { Channel };
