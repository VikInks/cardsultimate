import { RouteDefinition } from "./route.definition";

export interface RouteController {
	routePath: string;
	routes: RouteDefinition[];
}