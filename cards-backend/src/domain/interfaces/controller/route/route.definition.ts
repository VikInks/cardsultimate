export interface RouteDefinition {
	method: string;
	path: string;
	middlewares: string[];
	action: (...args: any[]) => any;
}