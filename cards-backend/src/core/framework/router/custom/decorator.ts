export function Route(path: string) {
	return function <T extends { new (...args: any[]): {} }>(constructor: T) {
		constructor.prototype.routePath = path;
		constructor.prototype.routes = [];
	};
}

function routeMethod(
	method: string,
	path: string,
	options?: { middlewares?: string[] }
) {
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		if (!target.routes) {
			target.routes = [];
		}

		const routeMiddlewareNames = options?.middlewares || [];

		target.routes.push({
			method: method,
			path: path,
			middlewares: routeMiddlewareNames,
			action: descriptor.value,
		});

		return descriptor;
	};
}


export const Post = (path: string, options?: { middlewares?: string[] }) =>
	routeMethod("post", path, options);
export const Get = (path: string, options?: { middlewares?: string[] }) =>
	routeMethod("get", path, options);
export const Put = (path: string, options?: { middlewares?: string[] }) =>
	routeMethod("put", path, options);
export const Delete = (path: string, options?: { middlewares?: string[] }) =>
	routeMethod("delete", path, options);
