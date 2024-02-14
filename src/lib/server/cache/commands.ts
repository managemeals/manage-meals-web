import client from '$lib/server/cache/redis';

const PREFIX = 'althingimoneyweb';

const EXPIRE = 60 * 60 * 24; // 24 hours
// const EXPIRE = 60 * 2; // 2 minutes

export const cacheSet = async (key: string, value: string) =>
	await client.set(`${PREFIX}.${key}`, value, { EX: EXPIRE });

export const cacheGet = async <T>(key: string): Promise<T | undefined> => {
	const results = await client.get(`${PREFIX}.${key}`);
	if (!results) {
		return;
	}
	return JSON.parse(results) as T;
};
