import {AuthMiddleware} from "../middleware/auth.middleware";
import {AdminMiddleware} from "../middleware/admin.middleware";
import {SuperuserMiddleware} from "../middleware/superuser.middleware";

type MiddlewareFactoryMap = {
	auth: typeof AuthMiddleware;
	isAdmin: typeof AdminMiddleware;
	isSuperUser: typeof SuperuserMiddleware;
};
const middlewareFactories: MiddlewareFactoryMap = {
	auth: AuthMiddleware,
	isAdmin: AdminMiddleware,
	isSuperUser: SuperuserMiddleware,
};

type MiddlewareInstanceMap<T> = {
	[K in keyof T]: T[K] extends new (...args: infer P) => infer R ? (...args: P) => R : never;
};

function createMiddlewareFactory<T extends Record<string, new (...args: any[]) => any>>(middlewareFactories: T): MiddlewareInstanceMap<T> {
	const middlewareFactory: Partial<MiddlewareInstanceMap<T>> = {};

	for (const key in middlewareFactories) {
		middlewareFactory[key as keyof T] = ((...args: any[]) => {
			const MiddlewareClass = middlewareFactories[key as keyof T];
			return new MiddlewareClass(...args);
		}) as any;
	}

	return middlewareFactory as MiddlewareInstanceMap<T>;
}

export const middlewareFactory = createMiddlewareFactory(middlewareFactories);

export class Middlewares {
}
