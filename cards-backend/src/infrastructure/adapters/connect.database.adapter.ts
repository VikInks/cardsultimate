import {Collection, Db, MongoClient} from 'mongodb';
import { Document } from "mongodb";
import {IDatabaseConnection} from "../../config/interfaces/adapters/database.interface";

export default class MongoDatabaseConnection extends IDatabaseConnection {
	client: MongoClient;
	db!: Db;

	constructor(private connectionString: string, private dbName: string) {
		super();
		this.client = new MongoClient(this.connectionString);
	}

	async connect(): Promise<void> {
		await this.client.connect().then(() => {
			console.log('connection to database established');
		}).catch((error) => {
			console.log('connection to database failed');
			throw error;
		});
		this.db = this.client.db(this.dbName);
		console.log('database set to', this.dbName);
	}

	async disconnect(): Promise<void> {
		await this.client.close();
	}

	async getCollection<T extends Document>(collectionName: string): Promise<Collection<T>> {
		return this.db.collection<T>(collectionName);
	}
}
