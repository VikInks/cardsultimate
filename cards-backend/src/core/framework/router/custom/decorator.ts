export function Route(path: string) {
	return function <T extends { new (...args: any[]): {} }>(constructor: T) {
		constructor.prototype.routePath = path;
		if (!constructor.prototype.routes) {
			constructor.prototype.routes = [];
		}
	};
}

export function routeMethod(
	method: string,
	path: string,
	options?: { middlewares?: string[] }
) {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		if (!target.constructor.prototype.routes) {
			target.constructor.prototype.routes = [];
		}

		const routeMiddlewareNames = options?.middlewares || [];

		target.constructor.prototype.routes.push({
			method: method,
			path: path,
			middlewares: routeMiddlewareNames,
			action: propertyKey,
		});

		return descriptor;
	};
}


export const Post = (path: string, options?: { middlewares?: string[] }) => routeMethod("post", path, options);
export const Get = (path: string, options?: { middlewares?: string[] }) => routeMethod("get", path, options);
export const Put = (path: string, options?: { middlewares?: string[] }) => routeMethod("put", path, options);
export const Delete = (path: string, options?: { middlewares?: string[] }) => routeMethod("delete", path, options);
