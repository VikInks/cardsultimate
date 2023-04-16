import MongoDatabaseConnection from "../../infrastructure/adapters/mongo.database.adapter";

export async function InitDatabase() {
	const url = process.env.MONGO_URL;
	const dbName = process.env.MONGO_DB_NAME;
	if(!url || !dbName) throw new Error('MONGO_URL or MONGO_DB_NAME is not set');
	try {
		const client = new MongoDatabaseConnection(url, dbName);
		await client.connect().then(() => {
		}).catch((error) => {
			console.log('connection to database failed');
			throw error;
		});

		return client;
	} catch (error) {
		console.error('Failed to connect to MongoDB:', error);
		throw error;
	}
}
