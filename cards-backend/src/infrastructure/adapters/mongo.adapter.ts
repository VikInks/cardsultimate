import {DatabaseInterface, WithOptionalIds} from '../../domain/interfaces/database.interface';
import {Document, ObjectId} from 'bson';
import {Collection, InsertOneResult, OptionalId} from "mongodb";

export class MongoAdapter<T extends Document> implements DatabaseInterface<T> {
	private readonly collectionName: string;
	private readonly collection: Collection

	constructor(private readonly input: { entityName: string, collection: Collection }) {
		this.collectionName = input.entityName.toLowerCase();
		this.collection = input.collection;
	}

	async insertOne(document: OptionalId<T>): Promise<InsertOneResult<T>> {
		return await this.collection.insertOne(document);
	}

	async findOne(query: any): Promise<T | null> {
		const entity = await this.collection.findOne(query);
		return entity ? await this.withId(entity._id?.toHexString() || entity.id) : null;
	}

	async findOneAndUpdate(query: any, update: any, options?: any): Promise<T | null> {
		const result = await this.collection.findOneAndUpdate(query, update, options);
		return result.value ? await this.withId(result.value._id?.toHexString() || result.value.id) : null;
	}

	async deleteOne(query: any): Promise<boolean> {
		const result = await this.collection.deleteOne(query);
		return result.deletedCount > 0;
	}

	stringToObjectId(id: string): ObjectId {
		return new ObjectId(id);
	}

	async find(): Promise<T[]> {
		const entities = await this.collection.find().toArray();
		if (!entities) throw new Error(`${this.collectionName} not found.`);
		return Promise.all(entities.map((entity) => this.withId(entity._id?.toHexString() || entity.id)));
	}

	async withId(entity: T & WithOptionalIds): Promise<T> {
		const entityId = entity._id?.toHexString() || entity.id;
		return { ...entity, id: entityId, _id: undefined } as T;
	}
}
