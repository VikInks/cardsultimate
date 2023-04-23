import { ServerInterface } from "../../../domain/interfaces/adapters/server.interface";
import { ControllersInterfaces } from "../../../domain/interfaces/types/controllers.interfaces";
import { RouteDefinitionInterface } from "../../../domain/interfaces/route/route.definition.interface";
import { MiddlewaresInterfaces } from "../../../domain/interfaces/types/middlewares.type";
import { generateSwagger } from "../../../doc/swagger.doc";
import swaggerUi from "swagger-ui-express";
import { CustomError } from "../../error/customError";
import { NextFunction, Request, Response } from "express";
import { INextFunction, IRequest, IResponse } from "../../../domain/interfaces/adapters/requestHandler.interface";
import { MiddlewareInterface } from "../../../domain/interfaces/adapters/middleware.interface";

function getActionFunction(controller: any, actionName: string) {
	if (typeof controller[actionName] === "function") {
		return controller[actionName].bind(controller);
	}
	return null;
}

export async function Router(
	expressAdapter: ServerInterface,
	middlewares: MiddlewaresInterfaces,
	controllerInstances: ControllersInterfaces
) {
	const app = expressAdapter.getApp();
	app.use(expressAdapter.json());
	app.use(expressAdapter.urlencoded({ extended: false }));

	const swaggerSpec = await generateSwagger();
	app.use("/swagger-admin/docs", swaggerUi.serve);
	app.get("/swagger-admin/docs", swaggerUi.setup(swaggerSpec));

	for (const controllerKey in controllerInstances) {
		const controller = controllerInstances[controllerKey];
		if (controller) {
			const routePath = (controller as any).routePath;
			const routes: RouteDefinitionInterface[] = (controller as any).routes;
			routes.forEach((route) => {
				const middlewaresInstances = route.middlewares.map(
					(middlewareName) =>
						middlewares[middlewareName as keyof MiddlewaresInterfaces]
				);
				const wrappedMiddlewares = middlewaresInstances.map(
					(middleware: MiddlewareInterface) => {
						return (req: IRequest, res: IResponse, next: INextFunction) => {
							middleware.handle(req, res, next);
						};
					}
				);
				const actionFunction = getActionFunction(controller, route.action);
				if (actionFunction) {
					expressAdapter.addRoute(
						route.method,
						routePath + route.path,
						wrappedMiddlewares,
						actionFunction
					);
				} else {
					console.warn(
						`Action for route "${route.method.toUpperCase()} ${
							routePath + route.path
						}" is undefined. Skipping route.`
					);
				}
			});
		}
	}

	// next is required for express to recognize this as an error handler
	app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
		if (err instanceof CustomError) {
			res.status(err.statusCode).json({ message: err.message });
		} else {
			console.error(err);
			res.status(500).json({ message: "Internal Server Error" });
		}
	});

	return app;
}
