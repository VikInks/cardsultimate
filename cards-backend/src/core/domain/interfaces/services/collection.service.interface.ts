import {CollectionEntityInterface} from "../../endpoints/collection/collection.entity.interface";
import {CardsEntityInterface} from "../../endpoints/cards/cards.entity.interface";

export interface CollectionServiceInterface {
	create(ownerId: string): Promise<CollectionEntityInterface>;
	delete(id: string, ownerId: string): Promise<boolean>;
	update(item: CardsEntityInterface, collectionId: string, ownerId: string): Promise<CollectionEntityInterface>;
	getCollectionByOwner(idOwner: string): Promise<CollectionEntityInterface | null>;
    addCardToCollection(collectionId: any, cardId: any, user: any): Promise<void>;
}