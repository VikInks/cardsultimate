
import { Document, ObjectId } from "bson";
import {Collection, InsertOneResult, OptionalId, WithId} from "mongodb";
import {DatabaseInterface} from "../../domain/interfaces/adapters/database.interface";

export class DbAdapter<T extends Document> implements DatabaseInterface<T> {
	private readonly collectionName: string;
	private readonly collection: Collection;

	constructor(
		private readonly input: { entityName: string; collection: Collection }
	) {
		this.collectionName = input.entityName.toLowerCase();
		this.collection = input.collection;
	}

	private convertToEntity(document: WithId<Document>): T {
		const converted = {
			...document,
			id: document._id.toHexString(),
			_id: undefined,
		} as unknown;

		return converted as T;
	}


	async insertOne(document: OptionalId<T>): Promise<InsertOneResult<T>> {
		return await this.collection.insertOne(document);
	}

	async findOne(query: any): Promise<T | null> {
		const document = await this.collection.findOne<WithId<Document>>(query);
		return document ? this.convertToEntity(document) : null;
	}

	async findOneAndUpdate(
		query: any,
		update: any,
		options?: any
	): Promise<T | null> {
		const result = await this.collection.findOneAndUpdate(query, update, options);
		return result.value ? this.convertToEntity(result.value) : null;
	}

	async deleteOne(query: any): Promise<boolean> {
		const result = await this.collection.deleteOne(query);
		return result.deletedCount > 0;
	}

	stringToObjectId(id: string): ObjectId {
		return new ObjectId(id);
	}

	async find(): Promise<T[]> {
		const documents = await this.collection.find().toArray();
		return documents.map(this.convertToEntity);
	}
}
