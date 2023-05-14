export interface RouteDefinitionInterface {
	method: string;
	path: string;
	middlewares: string[];
	action: string;
}