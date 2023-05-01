import {UserRepositoryInterface} from "../../domain/interfaces/repositories/user.repository.interface";
import {UserRepository} from "../../infrastructure/repositories/user.repository";
import {DatabaseInterface} from "../../domain/interfaces/adapters/database.interface";
import {DeckRepositoryInterface} from "../../domain/interfaces/repositories/deck.repository.interface";
import {DeckRepository} from "../../infrastructure/repositories/deck.repository";

type RepositoriesInterface = {
	user: UserRepositoryInterface;
	deck: DeckRepositoryInterface;
};

type DatabaseAdapters = {
	[K in keyof RepositoriesInterface]: DatabaseInterface<any>;
} & { [key: string]: DatabaseInterface<any> };

// TODO: créer le repository pour les decks
export function initRepositories(databaseAdapters: DatabaseAdapters): RepositoriesInterface {
	return {
		user: new UserRepository(databaseAdapters.user),
		deck: new DeckRepository(databaseAdapters.deck)
	};
}
