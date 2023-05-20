import {CollectionEntityInterface as Collection} from "../../endpoints/collection/collection.entity.interface";
import {CardsEntityInterface} from "../../endpoints/cards/cards.entity.interface";

export interface CollectionRepositoryInterface {
	create(collection: Collection): Promise<Collection>;
	update(card: CardsEntityInterface, collectionId:string, ownerId: string): Promise<Collection>;
	deleteById(id: string, ownerId: string): Promise<boolean>;
	getById(ownerId: string): Promise<Collection | null>;
}