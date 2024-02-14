import { connectRedis } from '$lib/server/cache/redis';
import { connectMongo } from '$lib/server/db/mongo';

try {
	await connectMongo();
	console.log('Mongo connected');
} catch (error) {
	console.error(error);
}

try {
	await connectRedis();
	console.log('Redis connected');
} catch (error) {
	console.error(error);
}
