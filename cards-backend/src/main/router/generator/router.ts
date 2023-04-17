import { CustomError } from "../../error/customError";
import { UserServiceInterface } from "../../../domain/interfaces/services/user.service.interface";
import { ServerInterface } from "../../../domain/interfaces/server.interface";
import { MiddlewareCollection } from "../../../domain/interfaces/middleware.interface";
import {NextFunction, Response, Request} from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import {generateSwagger} from "../../../domain/doc/swagger.doc";

async function Router(expressAdapter: ServerInterface, userService: UserServiceInterface, controllerInstances: any[], middlewares: MiddlewareCollection) {
	const app = expressAdapter.getApp();

	controllerInstances.forEach((instance) => {
		const routePath = instance.routePath;
		instance.routes.forEach((route: any) => {
			const { method, path, action, middlewares: routeMiddlewareNames } = route;
			if (method in app && typeof app[method] === "function") {
				const routeMiddlewareInstances = routeMiddlewareNames.map((name: keyof MiddlewareCollection) => middlewares[name]);
				(app as any)[method](routePath + path, ...routeMiddlewareInstances, action.bind(instance));
			} else {
				throw new Error(`Invalid method: ${method}`);
			}
		});
	});

	const jsdocOptions = await require(generateSwagger());
	const swaggerSpec = swaggerJSDoc(jsdocOptions);
	app.use('/cards-api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

	app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
		if (err instanceof CustomError) {
			res.status(err.statusCode).json({ message: err.message });
		} else {
			res.status(500).json({ message: "Internal Server Error" });
		}
	});
}

export default Router;
