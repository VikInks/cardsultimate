import { IRequest, IResponse } from "../../../domain/interfaces/requestHandler.interface";
import { CustomError } from "../../error/customError";
import { UserServiceInterface } from "../../../domain/interfaces/services/user.service.interface";
import { ServerInterface } from "../../../domain/interfaces/server.interface";
import { MiddlewareCollection } from "../../../domain/interfaces/middleware.interface";

function Router(expressAdapter: ServerInterface, userService: UserServiceInterface, controllerInstances: any[], middlewares: MiddlewareCollection) {
	const app = expressAdapter.getApp();

	controllerInstances.forEach((instance) => {
		const routePath = instance.routePath;
		instance.routes.forEach((route: any) => {
			const { method, path, action, middlewares: routeMiddlewareNames } = route;
			console.log(routeMiddlewareNames);
			if (method in app && typeof app[method] === "function") {
				const routeMiddlewareInstances = routeMiddlewareNames.map((name: keyof MiddlewareCollection) => middlewares[name]);
				(app as any)[method](routePath + path, ...routeMiddlewareInstances, action.bind(instance));
			} else {
				throw new Error(`Invalid method: ${method}`);
			}
		});
	});

	app.use((err: Error, req: IRequest, res: IResponse) => {
		if (err instanceof CustomError) {
			res.status(err.statusCode).json({ message: err.message });
		} else {
			res.status(500).json({ message: "Internal Server Error" });
		}
	});
}

export default Router;
