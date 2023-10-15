import { UserService } from "../../application/services/application/user.service";
import { EmailService } from "../../application/services/application/mail.service";
import { LoginService } from "../../application/services/application/login.service";
import { IdService } from "../../application/services/application/id.service";
import { TimeupService } from "../../application/services/application/timeup.service";
import {AuthorizationService} from "../../application/services/application/authorization.service";
import {CardService} from "../../application/services/application/card.service";
import {DeckService} from "../../application/services/application/deck.service";
import {CollectionService} from "../../application/services/application/collection.service";
import {BulkDataService} from "../../application/services/scryfall/bulk.data.service";
import {RedisService} from "../../application/services/redis/redis.service";

type ServiceClassMap = {
	UserService: UserService;
	EmailService: EmailService;
	LoginService: LoginService;
	IdService: IdService;
	TimeupService: TimeupService;
	AuthorizationService: AuthorizationService;
	CollectionService: CollectionService;
	CardService: CardService;
	DeckService: DeckService;
	BulkDataService: BulkDataService;
	RedisService: RedisService;
};

type ServiceConstructorMap = {
	[K in keyof ServiceClassMap]: new (...args: any[]) => ServiceClassMap[K];
};

const serviceClasses: ServiceConstructorMap = {
	UserService,
	EmailService,
	LoginService,
	IdService,
	TimeupService,
	AuthorizationService,
	CardService,
	DeckService,
	CollectionService,
	BulkDataService,
	RedisService
};

type ServiceInstanceMap<T> = {
	[K in keyof T]: T[K] extends new (...args: infer P) => infer R ? (...args: P) => R : never;
};

function createServiceFactory<T extends Record<string, new (...args: any[]) => any>>(serviceClasses: T): ServiceInstanceMap<T> {
	const serviceFactory: Partial<ServiceInstanceMap<T>> = {};

	for (const key in serviceClasses) {
		serviceFactory[key as keyof T] = ((...args: any[]) => {
			const ServiceClass = serviceClasses[key as keyof T];
			return new ServiceClass(...args);
		}) as any;
	}

	return serviceFactory as ServiceInstanceMap<T>;
}

export const serviceFactory = createServiceFactory(serviceClasses);
