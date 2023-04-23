import {RouteDefinitionInterface} from "../../../core/domain/interfaces/route/route.definition.interface";

export function Route(path: string) {
	return function <T extends { new (...args: any[]): {} }>(constructor: T) {
		return class extends constructor {
			routePath = path;
			routes: RouteDefinitionInterface[] = [];

			constructor(...args: any[]) {
				super(...args);
			}
		};
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
		registerRoute(target, method, path, options, descriptor);
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

function registerRoute(
	target: any,
	method: string,
	path: string,
	options: { middlewares?: string[] } | undefined,
	descriptor: PropertyDescriptor
): PropertyDescriptor {
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
}
