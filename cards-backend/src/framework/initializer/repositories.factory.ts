import {UserRepositoryInterface} from "../../config/interfaces/repositories/user.repository.interface";
import {UserRepository} from "../../infrastructure/repositories/user.repository";
import {DatabaseInterface} from "../../config/interfaces/adapters/database.interface";
import {DeckRepositoryInterface} from "../../config/interfaces/repositories/deck.repository.interface";
import {DeckRepository} from "../../infrastructure/repositories/deck.repository";
import {CollectionRepositoryInterface} from "../../config/interfaces/repositories/collection.repository.interface";
import {CollectionRepository} from "../../infrastructure/repositories/collection.repository";
import {CardRepositoryInterface} from "../../config/interfaces/repositories/card.repository.interface";
import {CardRepository} from "../../infrastructure/repositories/card.repository";

type RepositoriesInterface = {
	user: UserRepositoryInterface;
	deck: DeckRepositoryInterface;
	collection: CollectionRepositoryInterface;
	card: CardRepositoryInterface;
};

type DatabaseAdapters = {
	[K in keyof RepositoriesInterface]: DatabaseInterface<any>;
} & { [key: string]: DatabaseInterface<any> };

// TODO: créer le repository pour les decks
export function initRepositories(databaseAdapters: DatabaseAdapters): RepositoriesInterface {
	return {
		user: new UserRepository(databaseAdapters.user),
		deck: new DeckRepository(databaseAdapters.deck),
		collection: new CollectionRepository(databaseAdapters.collection),
		card: new CardRepository(databaseAdapters.card)
	};
}
