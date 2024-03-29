import {RouteControllerInterface} from "../../config/interfaces/route/route.controller.interface";

export function createRouteController<T>(controller: T): T & RouteControllerInterface {
	return controller as T & RouteControllerInterface;
}
