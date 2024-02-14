import { createClient } from 'redis';
import { REDIS_URL } from '$env/static/private';

const client = createClient({
	url: REDIS_URL
});

export const connectRedis = () => {
	console.log('Connecting redis');
	return client.connect();
};

export default client;
