/** @format */

import fs from 'fs/promises';
import logger from './logging';

class Cache {
	cachepath = 'cache';
	private memCache = new Map();
	constructor(cachepath?: string) {
		if (cachepath) this.cachepath = cachepath;
		logger.debug('initialized cache in ' + this.cachepath);
	}

	// TODO: (someday) check if there is a package that does this (NO NOT REDIS.)

	// See... there is a possible vulnerability that if we accept . or / you could just get anything in the file system...
	// So this regex checking should 'patch' it. though this is going to be mostly used for channel id's provided by YouTube so idk if the issue will ever happen...
	async get(key: string) {
        logger.debug(key +" before regex get")
		key = key.replace(/\\|\//g, '').replace(/\./g, ''); // FIXME: learn regex so i can combine these 2 into 1.
        logger.debug(key +" after regex get")
		const getMemory = this.memCache.get(key);
		if (getMemory) return getMemory != '' ? getMemory : null;
		const getFile = Bun.file(this.cachepath + '/' + 'cache_' + key);
		if (getFile.size == 0) {
			this.memCache.set(key, ''); // so that we dont need to do useless fs checks...
			return null;
		}
		const getData = await getFile.text();
		this.memCache.set(key, getData); // so that we dont need to do useless fs checks...
		return getData;
	}
	async set(key: string, data: string) {
        logger.debug(key +" before regex set")
		key = key.replace(/\\|\//g, '').replace(/\./g, ''); // FIXME: above fixme ^^
        logger.debug(key +" after regex set")
		this.memCache.set(key, data);
		await fs.writeFile(this.cachepath + '/' + 'cache_' + key, data); // we'll save it to the disk...
	}
}

export default Cache;
