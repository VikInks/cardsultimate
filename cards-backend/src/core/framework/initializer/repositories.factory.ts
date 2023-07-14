import {UserRepositoryInterface} from "../../domain/interfaces/repositories/user.repository.interface";
import {UserRepository} from "../../infrastructure/repositories/user.repository";
import {DatabaseInterface} from "../../domain/interfaces/adapters/database.interface";
import {CollectionRepositoryInterface} from "../../domain/interfaces/repositories/collection.repository.interface";
import {CollectionRepository} from "../../infrastructure/repositories/collection.repository";

type RepositoriesInterface = {
	user: UserRepositoryInterface;
	collection: CollectionRepositoryInterface
};

type DatabaseAdapters = {
	[K in keyof RepositoriesInterface]: DatabaseInterface<any>;
} & { [key: string]: DatabaseInterface<any> };

export function initRepositories(databaseAdapters: DatabaseAdapters): RepositoriesInterface {
	return {
		user: new UserRepository(databaseAdapters.user),
		collection: new CollectionRepository(databaseAdapters.collection)
	};
}
