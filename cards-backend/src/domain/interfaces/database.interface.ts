export interface WithOptionalIds<T = string> {
	_id?: T;
	id?: string;
}

export interface DatabaseInterface<T> {
	insertOne(document: any): Promise<any>;
	findOne(query: any): Promise<T | null>;
	findOneAndUpdate(query: any, update: any, options?: any): Promise<T | null>;
	deleteOne(query: any): Promise<boolean>;
	withId(entity: T & WithOptionalIds): Promise<T>;
	stringToObjectId(id: string): any;
	find<T0>(collectionName: string): Promise<T0[]>;
}

export class IDatabaseConnection {
	async connect() {
		throw new Error('Not implemented');
	}

	async disconnect() {
		throw new Error('Not implemented');
	}
}


