import {BaseRepositoryInterface} from "./base.repository.interface";
import {CollectionEntityInterface as Collection} from "../../endpoints/collection/collection.entity.interface";

// todo : create a collection when a user is registered
// todo : delete a collection when a user is deleted because of no confirmation at registration when the link expires
// todo : keep a collection if a user is archived, delete it if the user is permanently deleted after a period of time
export interface CollectionRepositoryInterface extends BaseRepositoryInterface<Collection> {
	// inherited from BaseRepositoryInterface
	create(collection: Collection): Promise<Collection>;
	findById(id: string): Promise<Collection | null>;
	update(id: string, collection: Collection): Promise<Collection>;
	deleteById(id: string): Promise<boolean>;
}