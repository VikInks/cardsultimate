import {DatabaseInterface, WithOptionalIds} from '../../domain/interfaces/database.interface';
import { ObjectId } from 'bson';
export class MongoAdapter<T> implements DatabaseInterface<T> {
	private readonly collectionName: string;
	private readonly db: any

	constructor(private readonly input: { entityName: string, db: any }) {
		this.collectionName = input.entityName.toLowerCase();
		this.db = input.db;
	}

	async insertOne(document: any): Promise<any> {
		const result = await this.db.collection(this.collectionName).insertOne(document);
		return { ...document, id: result.insertedId.toHexString() };
	}

	async findOne(query: any): Promise<T | null> {
		return await this.db.collection(this.collectionName).findOne(query);
	}

	async findOneAndUpdate(query: any, update: any, options?: any): Promise<T | null> {
		const result = await this.db.collection(this.collectionName).findOneAndUpdate(query, update, options);
		return result.value;
	}

	async deleteOne(query: any): Promise<boolean> {
		const result = await this.db.collection(this.collectionName).deleteOne(query);
		return result.deletedCount > 0;
	}

	stringToObjectId(id: string): ObjectId {
		return new ObjectId(id);
	}

	async find<T>(collectionName: string): Promise<T[]> {
		const entities = await this.db.collection(collectionName).find().toArray();
		if (!entities) throw new Error(`${this.collectionName} not found.`);
		return entities.map((entity: T & WithOptionalIds<ObjectId>) => this.withId(entity));
	}

	async withId<T>(entity: T & WithOptionalIds<ObjectId>): Promise<T> {
		const entityId = entity._id?.toHexString() || entity.id;
		return { ...entity, id: entityId, _id: undefined } as T;
	}
}