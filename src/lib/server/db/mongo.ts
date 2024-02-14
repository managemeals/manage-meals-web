import { MONGO_DB, MONGO_URL } from '$env/static/private';
import { MongoClient } from 'mongodb';

const client = new MongoClient(MONGO_URL);

export const connectMongo = (): Promise<MongoClient> => {
	console.log('Connecting mongo');
	return client.connect();
};

export default client.db(MONGO_DB);
