/** @format */

interface Channel {
	// everything is kinda optional since we'll be using this interface for everything channel related.
	avatar?: string;
	title?: string;
	handle?: string;
	channel_id: string;
	subscribers?: number | null;
	views?: number | null;
	videos?: number | null;
}

interface Metafile {
	youtube_channels: MetaChannel[];
	subscribes: Subscriber[];
}
interface MetaChannel {
	channel_id: string;
	subscriberIDs: string[]; // its basically an array of subscriberID's
	currentUpdate?: updateRecord;
	lastUpdate?: updateRecord;
}
interface updateRecord {
	subscribers: number;
	hit: string; // new Date().toISOString() string
	timeTook: number; // milliseconds; how we calc it => Date.now() - new Date(MetaChannel.lastUpdate.hit).getTime()
	sub_rate: number; // how we calc it =>
	//1. CurrentSubs - MetaChannel.lastUpdate.subscribers
	//2. Date.now() - new Date(MetaChannel.lastUpdate.hit).getTime()
	//3. p1 / p2 and we get subs per ms which we can use for anything
}
// wont be saved to updateRecord as we can always recreate it.
interface Averages {
	second: number; //updateRecord.sub_rate*1000
	minute: number; //updateRecord.sub_rate*1000*60
	hour: number; //updateRecord.sub_rate*1000*60*60
	day: number; //updateRecord.sub_rate*1000*60*60*24
}
interface Subscriber {
	subscriberID: string; // some random generated id
	channel_id: string;
	isGuild: boolean; // needed for dm tracking reasons
	discord_channel: string; // the text / private dm channel id
	user_id: string;
	when: string; // toISOString()
	guild_id?: string; // optional, needed for counting how many users are tracked in a guild
}

export { Channel, Metafile, updateRecord, Averages, Subscriber };
