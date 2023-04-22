import {CustomError} from "../../error/customError";
import {MiddlewareInterface} from "../../../domain/interfaces/middleware.interface";
import express, {Response, Request, NextFunction} from "express";
import cookieParser from 'cookie-parser';
import {ServerInterface} from "../../../domain/interfaces/server.interface";
import {ServiceInterfaces} from "../../../domain/interfaces/types/services.interfaces";
import {ControllersInterfaces} from "../../../domain/interfaces/types/controllers.interfaces";
import {RouteController} from "../../../domain/interfaces/controller/route/route.controller";
import cors from "cors";
import {middlewareFactory} from "../../initializer/middleware.factory";


function isRouteController(obj: any): obj is RouteController {
	return 'routePath' in obj && 'routes' in obj;
}

export class Router {
	constructor(
		private expressAdapter: ServerInterface,
		private services: ServiceInterfaces,
		private controllerInstances: ControllersInterfaces
	) {
		this.configureRoutes();
	}

	private authMiddleware: MiddlewareInterface = middlewareFactory.auth()
	private adminMiddleware: MiddlewareInterface = middlewareFactory.isAdmin(this.services.userService);
	private superuserMiddleware: MiddlewareInterface = middlewareFactory.isSuperUser(this.services.userService);

	private middlewares: { [key: string]: MiddlewareInterface } = {
		authMiddleware: this.authMiddleware,
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

		app.get("/swagger-admin/docs", this.superuserMiddleware.handle.bind(
			this.middlewares.isSuperUser),
			this.controllerInstances.swaggerAuthController.docs
		);

		// next is required for express to recognize this as an error handler
		app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
			if (err instanceof CustomError) {
				res.status(err.statusCode).json({message: err.message});
			} else {
				console.error(err);
				res.status(500).json({message: "Internal Server Error"});
			}
		});
	}
}
