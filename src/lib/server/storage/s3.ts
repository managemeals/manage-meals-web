import { S3_BUCKET, S3_ENDPOINT, S3_KEY, S3_REGION, S3_SECRET } from '$env/static/private';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const client = new S3Client({
	region: S3_REGION,
	endpoint: S3_ENDPOINT,
	credentials: {
		accessKeyId: S3_KEY,
		secretAccessKey: S3_SECRET
	}
});

export const uploadFile = async () => {
	const data = await client.send(
		new PutObjectCommand({
			ACL: 'public-read',
			Bucket: S3_BUCKET,
			Key: 'nomnom/example.txt',
			Body: 'content'
		})
	);
	console.log(data);
};
