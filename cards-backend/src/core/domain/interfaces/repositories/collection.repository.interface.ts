import {CollectionEntityInterface as Collection} from "../../endpoints/collection/collection.entity.interface";

export interface CollectionRepositoryInterface {
	create(collection: Collection, ownerId: string): Promise<Collection>;
	update(collection: Collection, ownerId: string): Promise<Collection>;
	deleteById(id: string, ownerId: string): Promise<boolean>;
	getById(ownerId: string): Promise<Collection | null>;
}