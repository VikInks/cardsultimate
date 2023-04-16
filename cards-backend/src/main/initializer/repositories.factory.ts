import { UserRepositoryInterface } from "../../domain/interfaces/repositories/user.repository.interface";
import { UserRepository } from "../../infrastructure/repositories/user.repository";
import { DatabaseInterface } from "../../domain/interfaces/database.interface";
import { BaseFactory } from "./base.factory";

type RepositoryClass = new (...args: any[]) => any;

type RepositoriesInterface = {
	user: UserRepositoryInterface;
};

type RepositoryKeyMap = {
	[K in keyof RepositoriesInterface]: RepositoryClass;
};

const repositoryKeyMap: RepositoryKeyMap = {
	user: UserRepository,
};

type DatabaseAdapters = {
	[K in keyof RepositoriesInterface]: DatabaseInterface<any>;
} & { [key: string]: DatabaseInterface<any> };

export class RepositoryFactory extends BaseFactory {
	constructor(private readonly databaseAdapters: DatabaseAdapters) {
		super();
	}

	getInstanceOrCreate(RepositoryClass: RepositoryClass): any {
		const existingInstance = this.getInstance<any>(RepositoryClass.name);
		if (existingInstance) {
			return existingInstance;
		}
		const newInstance = new RepositoryClass(this.databaseAdapters[RepositoryClass.name]);
		this.registerInstance(RepositoryClass.name, newInstance);
		return newInstance;
	}
}

export function initRepositories(databaseAdapters: DatabaseAdapters): RepositoriesInterface {
	const repositoryFactory = new RepositoryFactory(databaseAdapters);
	const repositories = {} as RepositoriesInterface;

	for (const key of Object.keys(repositoryKeyMap) as (keyof RepositoriesInterface)[]) {
		repositories[key] = repositoryFactory.getInstanceOrCreate(repositoryKeyMap[key]);
	}

	return repositories;
}
