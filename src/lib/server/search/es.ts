import { ES_HOST } from '$env/static/private';
import { Client } from '@elastic/elasticsearch';

const client = new Client({
	node: ES_HOST
});

export default client;
