import {
	HttpMethod,
	HttpRequest,
	HttpResponse,
	HttpServer,
	NextFunction
} from "../../../domain/interfaces/adapters/server.interface";
import {BiscuitInterface} from "../../../domain/interfaces/adapters/biscuit.interface";
import {DocUiInterface} from "../../../domain/interfaces/adapters/docUi.Interface";
import {MiddlewaresInterfaces} from "../../../domain/interfaces/types/middlewares.type";
import {ErrorHandlerMiddleware} from "../../middleware/error.handler.middleware";
import {generateDoc} from "../../../doc/swagger.doc";
import {LoginControllerInterface} from "../../../domain/interfaces/controllers/login.controller.interface";
import {UserControllerInterface} from "../../../domain/interfaces/controllers/user.controller.interface";
import {CollectionControllerInterface} from "../../../domain/interfaces/controllers/collection.controller.interface";
import {DeckControllerInterface} from "../../../domain/interfaces/controllers/deck.controller.interface";
import cors from "cors";
import {RouteDefinitionInterface} from "../../../domain/interfaces/route/route.definition.interface";
import {MiddlewareInterface} from "../../../domain/interfaces/adapters/middleware.interface";

type ControllersInterfaces = [LoginControllerInterface, UserControllerInterface, CollectionControllerInterface, DeckControllerInterface];

export async function Router(
	serverAdapter: HttpServer,
	biscuitAdapter: BiscuitInterface,
	docUiAdapter: DocUiInterface,
	middlewares: MiddlewaresInterfaces,
	controllerInstances: ControllersInterfaces
) {
	const app = serverAdapter.getApp();
	await setupSwaggerDocs(app, docUiAdapter);
	setupMiddlewares(app, serverAdapter, biscuitAdapter, middlewares);
	setupRoutes(serverAdapter, controllerInstances, middlewares);
	return app;
}

function setupMiddlewares(app: any, serverAdapter: HttpServer, biscuitAdapter: BiscuitInterface, middlewares: MiddlewaresInterfaces) {
	app.use(serverAdapter.json());
	app.use(serverAdapter.urlencoded({ extended: false }));
	app.use(cors());
	app.use(middlewares.rateLimitRequest.handle);
	app.use(biscuitAdapter.biscuitParser());
	app.use(ErrorHandlerMiddleware);
}

async function setupSwaggerDocs(app: any, docUiAdapter: DocUiInterface) {
	const swaggerSpec = await generateDoc();
	app.use("/swagger-admin/docs", docUiAdapter.docUiServe);
	app.get("/swagger-admin/docs", docUiAdapter.docUiSetup(swaggerSpec));
}

function setupRoutes(serverAdapter: HttpServer, controllerInstances: ControllersInterfaces, middlewares: MiddlewaresInterfaces) {
	try {
		for (const controllerKey in controllerInstances) {
			const controller = controllerInstances[controllerKey];
			const routePath = (controller as any).routePath;
			const routes: RouteDefinitionInterface[] = (controller as any).routes;
			if (controller && routePath && routes) {
				routes.forEach(route => {
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
						return serverAdapter.handleRequest(
							route.method as HttpMethod,
							routePath + route.path,
							wrappedMiddlewares,
							actionFunction
						);
					}
					console.log(`Action function ${route.action} not found in controller ${controller.constructor.name}`);
				});
			}
		}
	} catch (error) {
		console.error(error);
	}
}

function getActionFunction(controller: any, actionName: string) {
	return typeof controller[actionName] === "function" ? controller[actionName].bind(controller) : null;
}