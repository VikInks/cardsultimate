import { EmailAdapter } from "../../infrastructure/adapters/email.adapter";
import { BcryptAdapter } from "../../infrastructure/adapters/bcrypt.adapter";
import { ExpressAdapter } from "../../infrastructure/adapters/express.adapter";
import { PassportAdapter } from "../../infrastructure/adapters/passport.adapter";
import { UuidAdapter } from "../../infrastructure/adapters/uuid.adapter";
import { MongoAdapter } from "../../infrastructure/adapters/mongo.adapter";
import {SwaggerAdapter} from "../../infrastructure/adapters/swagger.adapter";

type AdapterClassMap<T> = {
	bcrypt: BcryptAdapter,
	email: EmailAdapter,
	express: ExpressAdapter,
	passport: PassportAdapter,
	uuid: UuidAdapter,
	mongo: MongoAdapter<T>,
	swagger: SwaggerAdapter,
};

type AdapterConstructorMap<T> = {
	[K in keyof AdapterClassMap<T>]: new (...args: any[]) => AdapterClassMap<T>[K];
};

const adapterClasses: AdapterConstructorMap<any> = {
	bcrypt: BcryptAdapter,
	email: EmailAdapter,
	express: ExpressAdapter,
	passport: PassportAdapter,
	uuid: UuidAdapter,
	mongo: MongoAdapter,
	swagger: SwaggerAdapter,
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
	db: any;
};

export function createTypedMongoAdapter<T>(input: MongoAdapterInput): MongoAdapter<T> {
	return new MongoAdapter<T>(input);
}

