import {RouteController} from "../../domain/interfaces/controller/route/route.controller";

export function createRouteController<T>(controller: T): T & RouteController {
	return controller as T & RouteController;
}
