import {CollectionEntityInterface} from "../../../domain/collection/collection.entity.interface";
import {CardsEntityInterface} from "../../../domain/cards/cards.entity.interface";


export interface CollectionServiceInterface {
	create(ownerId: string): Promise<CollectionEntityInterface | null>;
	delete(id: string, ownerId: string): Promise<void | null>;
	update(item: CardsEntityInterface[], collectionId: string, ownerId: string): Promise<CollectionEntityInterface | null>;
	getCollectionByOwner(idOwner: string): Promise<CollectionEntityInterface | null>;
	publicCanView(ownerId: string, id: string, isPrivate: boolean): Promise<CollectionEntityInterface | null>;
	sellManagerCollection(id: string, ownerId: string): Promise<CollectionEntityInterface | null>;
}