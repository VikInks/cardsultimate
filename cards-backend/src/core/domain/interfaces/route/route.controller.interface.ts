import { RouteDefinitionInterface } from "./route.definition.interface";

export interface RouteControllerInterface {
	routePath: string;
	routes: RouteDefinitionInterface[];
}