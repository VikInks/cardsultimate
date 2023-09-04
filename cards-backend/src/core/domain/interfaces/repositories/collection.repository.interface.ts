import {CollectionEntityInterface} from "../../endpoints/collection/collection.entity.interface";
import {CardsEntityInterface} from "../../endpoints/cards/cards.entity.interface";

export interface CollectionRepositoryInterface {
	create(collection: CollectionEntityInterface): Promise<CollectionEntityInterface>;
	update(cardIds: CardsEntityInterface[], collectionId:string, ownerId: string): Promise<CollectionEntityInterface>;
	deleteById(id: string, ownerId: string): Promise<boolean>;
	getById(ownerId: string): Promise<CollectionEntityInterface | null>;
    addCardToCollection(collectionId: string, card: CardsEntityInterface, user: string): Promise<CollectionEntityInterface>;
	setViewCollection(collectionId: string, isPrivate: boolean): Promise<CollectionEntityInterface>;
}