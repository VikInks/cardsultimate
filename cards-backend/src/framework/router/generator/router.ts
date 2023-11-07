import {
	HttpMethod,
	HttpRequest,
	HttpResponse,
	HttpServer,
	NextFunction
} from "../../../config/interfaces/adapters/server.interface";
import {BiscuitInterface} from "../../../config/interfaces/adapters/biscuit.interface";
import {DocUiInterface} from "../../../config/interfaces/adapters/docUi.Interface";
import {MiddlewaresInterfaces} from "../../../config/interfaces/types/middlewares.type";
import {generateDoc} from "../../../config/doc/swagger.doc";
import {LoginControllerInterface} from "../../../config/interfaces/controllers/login.controller.interface";
import {UserControllerInterface} from "../../../config/interfaces/controllers/user.controller.interface";
import {CollectionControllerInterface} from "../../../config/interfaces/controllers/collection.controller.interface";
import {DeckControllerInterface} from "../../../config/interfaces/controllers/deck.controller.interface";
import cors from "cors";
import {RouteDefinitionInterface} from "../../../config/interfaces/route/route.definition.interface";
import {MiddlewareInterface} from "../../../config/interfaces/adapters/middleware.interface";

type ControllersInterfaces = [LoginControllerInterface, UserControllerInterface, DeckControllerInterface, CollectionControllerInterface];

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
	app.use(middlewares.logging.handle);
	app.use(biscuitAdapter.biscuitParser());
}

async function setupSwaggerDocs(app: any, docUiAdapter: DocUiInterface) {
	const swaggerSpec = await generateDoc();
	app.use("/swagger/", docUiAdapter.docUiServe);
	app.get("/swagger/", docUiAdapter.docUiSetup(swaggerSpec));
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