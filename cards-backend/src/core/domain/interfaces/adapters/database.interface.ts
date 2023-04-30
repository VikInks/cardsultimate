import { Collection, Document, InsertOneResult, ObjectId, OptionalId } from "mongodb";

export interface DatabaseInterface<T extends Document> {
	insertOne(doc: OptionalId<T>): Promise<InsertOneResult<T>>;
	findOne(query: any): Promise<T | null>;
	findOneAndUpdate(query: any, update: any, options?: any): Promise<T | null>;
	deleteOne(query: any): Promise<boolean>;
	stringToObjectId(id: string): ObjectId;
	find(): Promise<T[]>;
}

export abstract class IDatabaseConnection {
	abstract connect(): Promise<void>;
	abstract disconnect(): Promise<void>;
	abstract getCollection<T extends Document>(collectionName: string): Promise<Collection<T>>;
}
