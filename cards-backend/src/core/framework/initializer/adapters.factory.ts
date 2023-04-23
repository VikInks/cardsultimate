import { EmailAdapter } from "../../infrastructure/adapters/email.adapter";
import { BcryptAdapter } from "../../infrastructure/adapters/bcrypt.adapter";
import { ExpressAdapter } from "../../infrastructure/adapters/express.adapter";
import { PassportAdapter } from "../../infrastructure/adapters/passport.adapter";
import { UuidAdapter } from "../../infrastructure/adapters/uuid.adapter";
import { MongoAdapter } from "../../infrastructure/adapters/mongo.adapter";
import {Document} from "bson";
import {Collection} from "mongodb";
import {TokenAdapter} from "../../infrastructure/adapters/token.adapter";

type AdapterClassMap<T extends Document> = {
	bcrypt: BcryptAdapter,
	email: EmailAdapter,
	express: ExpressAdapter,
	passport: PassportAdapter,
	uuid: UuidAdapter,
	mongo: MongoAdapter<T>,
	token: TokenAdapter,
};

type AdapterConstructorMap<T extends Document> = {
	[K in keyof AdapterClassMap<T>]: new (...args: any[]) => AdapterClassMap<T>[K];
};

const adapterClasses: AdapterConstructorMap<Document> = {
	bcrypt: BcryptAdapter,
	email: EmailAdapter,
	express: ExpressAdapter,
	passport: PassportAdapter,
	uuid: UuidAdapter,
	mongo: MongoAdapter,
	token: TokenAdapter,
};

type AdapterInstanceMap<T> = {
	[K in keyof T]: T[K] extends new (...args: infer P) => infer R ? (...args: P) => R : never;
};

export function createAdapterFactory<T extends Record<string, new (...args: any[]) => any>, U = any>(adapterClasses: T): AdapterInstanceMap<T> {
	const adapterFactory: Partial<AdapterInstanceMap<T>> = {};

	for (const key in adapterClasses) {
		adapterFactory[key as keyof T] = ((...args: any[]) => {
			const AdapterClass = adapterClasses[key as keyof T];
			return new AdapterClass(...args);
		}) as any;
	}

	return adapterFactory as AdapterInstanceMap<T>;
}

export const adapterFactory = createAdapterFactory(adapterClasses);

type MongoAdapterInput = {
	entityName: string;
	collection: Collection;
};

export function createTypedMongoAdapter<T extends Document>(input: MongoAdapterInput): MongoAdapter<T> {
	return new MongoAdapter<T>(input);
}
