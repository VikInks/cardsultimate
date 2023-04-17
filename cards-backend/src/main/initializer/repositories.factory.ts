import {UserRepositoryInterface} from "../../domain/interfaces/repositories/user.repository.interface";
import {UserRepository} from "../../infrastructure/repositories/user.repository";
import {DatabaseInterface} from "../../domain/interfaces/database.interface";

type RepositoriesInterface = {
	user: UserRepositoryInterface;
};

type DatabaseAdapters = {
	[K in keyof RepositoriesInterface]: DatabaseInterface<any>;
} & { [key: string]: DatabaseInterface<any> };

export function initRepositories(databaseAdapters: DatabaseAdapters): RepositoriesInterface {
	return {
		user: new UserRepository(databaseAdapters.user),
	};
}
