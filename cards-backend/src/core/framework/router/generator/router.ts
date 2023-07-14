import { ControllersInterfaces } from "../../../domain/interfaces/types/controllers.interfaces";
import { RouteDefinitionInterface } from "../../../domain/interfaces/route/route.definition.interface";
import { MiddlewaresInterfaces } from "../../../domain/interfaces/types/middlewares.type";
import { generateDoc } from "../../../doc/swagger.doc";
import { CustomError } from "../../error/customError";
import { MiddlewareInterface } from "../../../domain/interfaces/adapters/middleware.interface";
import cors from "cors";
import { BiscuitInterface } from "../../../domain/interfaces/adapters/biscuit.interface";
import { DocUiInterface } from "../../../domain/interfaces/adapters/docUi.Interface";
import {
	HttpMethod,
	HttpRequest,
	HttpResponse,
	HttpServer,
	NextFunction
} from "../../../domain/interfaces/adapters/server.interface";


function getActionFunction(controller: any, actionName: string) {
	if (typeof controller[actionName] === "function") {
		return controller[actionName].bind(controller);
	}
	return null;
}

export async function Router(
	serverAdapter: HttpServer,
	biscuitAdapter: BiscuitInterface,
	docUiAdapter: DocUiInterface,
	middlewares: MiddlewaresInterfaces,
	controllerInstances: ControllersInterfaces
) {
	const app = serverAdapter.getApp();
	app.use(serverAdapter.json());
	app.use(serverAdapter.urlencoded({ extended: false }));
	app.use(cors());
	app.use(middlewares.rateLimitRequest.handle);

	app.use(biscuitAdapter.biscuitParser());

	const swaggerSpec = await generateDoc();
	app.use("/swagger-admin/docs", docUiAdapter.docUiServe);
	app.get("/swagger-admin/docs", docUiAdapter.docUiSetup(swaggerSpec));

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
						return (req: HttpRequest, res: HttpResponse, next: NextFunction) => {
							middleware.handle(req, res, next);
						};
					}
				);
				const actionFunction = getActionFunction(controller, route.action);
				if (actionFunction) {
					serverAdapter.handleRequest(
						route.method as HttpMethod,
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
	app.use((err: Error, req: HttpRequest, res: HttpResponse, next: NextFunction) => {
		if (err instanceof CustomError) {
			res.status(err.statusCode).json({ message: err.message });
		} else {
			console.error(err);
			res.status(500).json({ message: "Internal Server Error" });
		}
	});

	return app;
}
