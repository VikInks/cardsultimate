import { RouteControllerInterface } from "../../../domain/interfaces/route/route.controller.interface";
import { ServerInterface } from "../../../domain/interfaces/adapters/server.interface";
import { ServiceInterfaces } from "../../../domain/interfaces/types/services.interfaces";
import { ControllersInterfaces } from "../../../domain/interfaces/types/controllers.interfaces";
import { MiddlewareFactoryInterface } from "../../../domain/interfaces/factories/middleware.factory.interface";
import { middlewareFactory } from "../../initializer/middleware.factory";
import { MiddlewareInterface } from "../../../domain/interfaces/adapters/middleware.interface";
import express, { NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { CustomError } from "../../error/customError";
import { generateSwagger } from "../../../doc/swagger.doc";

function isRouteController(obj: any): obj is RouteControllerInterface {
	const result = "routePath" in obj && "routes" in obj;
	console.log("Checking if object is RouteController:", obj, "Result:", result);
	return result;
}


export class Router {
	private middlewareFactoryInstance: MiddlewareFactoryInterface;
	private middlewares: { [key: string]: MiddlewareInterface };

	constructor(
		private expressAdapter: ServerInterface,
		private services: ServiceInterfaces,
		private controllerInstances: ControllersInterfaces
	) {
		this.middlewareFactoryInstance = middlewareFactory(this.services.authorizationService);
		this.middlewares = {
			adminMiddleware: this.middlewareFactoryInstance.isAdmin(),
			superuserMiddleware: this.middlewareFactoryInstance.isSuperUser(),
		};
		this.configureRoutes();
	}

	async configureRoutes() {
		const app = this.expressAdapter.getApp();
		app.use(express.json());
		app.use(express.urlencoded({ extended: false }));

		for (const controllerKey in this.controllerInstances) {
			const controller = this.controllerInstances[controllerKey];
			if (isRouteController(controller)) {
				const routePath = controller.routePath;
				const routes = controller.routes;
				routes.forEach((route) => {
					console.log(route.method, routePath + route.path, route.action);
					const middlewares = route.middlewares.map((middlewareName) => this.middlewares[middlewareName]);
					this.expressAdapter.addRoute(route.method, routePath + route.path, middlewares, route.action);
				});
			}
		}

		const swaggerSpec = await generateSwagger();
		app.use("/swagger-admin/docs", swaggerUi.serve);
		app.get("/swagger-admin/docs", swaggerUi.setup(swaggerSpec));

		// next is required for express to recognize this as an error handler
		app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
			if (err instanceof CustomError) {
				res.status(err.statusCode).json({ message: err.message });
			} else {
				console.error(err);
				res.status(500).json({ message: "Internal Server Error" });
			}
		});
	}
}
