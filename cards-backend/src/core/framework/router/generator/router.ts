import { CustomError } from "../../../core/framework/error/customError";
import { MiddlewareInterface } from "../../../core/domain/interfaces/adapters/middleware.interface";
import express, { Response, Request, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { ServerInterface } from "../../../core/domain/interfaces/adapters/server.interface";
import { ServiceInterfaces } from "../../../core/domain/interfaces/types/services.interfaces";
import { ControllersInterfaces } from "../../../core/domain/interfaces/types/controllers.interfaces";
import { RouteControllerInterface } from "../../../core/domain/interfaces/route/route.controller.interface";
import cors from "cors";
import { middlewareFactory } from "../../../core/framework/initializer/middleware.factory";
import { MiddlewareFactoryInterface } from "../../../core/domain/interfaces/factories/middleware.factory.interface";

function isRouteController(obj: any): obj is RouteControllerInterface {
	return "routePath" in obj && "routes" in obj;
}

export class Router {
	constructor(
		private expressAdapter: ServerInterface,
		private services: ServiceInterfaces,
		private controllerInstances: ControllersInterfaces
	) {
		this.configureRoutes();
	}

	private middlewareFactoryInstance: MiddlewareFactoryInterface = middlewareFactory(this.services.authorizationService);
	private adminMiddleware: MiddlewareInterface = this.middlewareFactoryInstance.isAdmin();
	private superuserMiddleware: MiddlewareInterface = this.middlewareFactoryInstance.isSuperUser();

	private middlewares: { [key: string]: MiddlewareInterface } = {
		adminMiddleware: this.adminMiddleware,
		superuserMiddleware: this.superuserMiddleware,
	};

	async configureRoutes() {
		const app = this.expressAdapter.getApp();
		app.use(express.json());
		app.use(cookieParser());
		app.use(cors());

		for (const controllerKey in this.controllerInstances) {
			const controller = this.controllerInstances[controllerKey];
			if (isRouteController(controller)) {
				const routePath = controller.routePath;
				const routes = controller.routes;

				routes.forEach((route) => {
					const middlewares = route.middlewares.map((middlewareName) => this.middlewares[middlewareName]);
					this.expressAdapter.addRoute(route.method, routePath + route.path, middlewares, route.action);
				});
			}
		}

		// app.get("/swagger-admin/docs", this.superuserMiddleware.handle.bind(this.superuserMiddleware), this.controllerInstances.swaggerAuthController.docs);

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
