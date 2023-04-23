import * as dotenv from "dotenv";
import {adapterFactory, createTypedMongoAdapter} from "./core/framework/initializer/adapters.factory";
import {InitDatabase} from "./core/framework/initializer/initDatabase";
import {serviceFactory} from "./core/framework/initializer/services.factory";
import {controllerFactory} from "./core/framework/initializer/controllers.factory";
import {initRepositories} from "./core/framework/initializer/repositories.factory";
import {UserEntitiesInterface} from "./core/domain/entities/user.entities.interface";
import * as http from "http";
import {createSuperUserIfNotExists} from "./dev/createsuperuser";
import { Router } from './core/framework/router/generator/router';
import {ServiceInterfaces} from "./core/domain/interfaces/types/services.interfaces";
import {ControllersInterfaces} from "./core/domain/interfaces/types/controllers.interfaces";
import {createRouteController} from "./core/framework/initializer/route.controller.factory";

dotenv.config({path: __dirname + '/.env'});

InitDatabase().then(async (db) => {
	console.log('Database connected');

	// Initialize the adapters
	const bcryptAdapter = adapterFactory.bcrypt();
	const emailAdapter = adapterFactory.email(process.env.NODE_ENV === 'production' ? 'production' : 'development');
	const expressAdapter = adapterFactory.express();
	const passportAdapter = adapterFactory.passport();
	const uuidAdapter = adapterFactory.uuid();
	const tokenAdapter = adapterFactory.token();

	// Initialize the database user adapter for user repository
	const mongUserAdapter = createTypedMongoAdapter<UserEntitiesInterface>({
		entityName: 'user',
		collection: await db.getCollection('user')
	});

	// Initialize the repositories
	const repositoryFactory = initRepositories({
		user: mongUserAdapter,
	});
	const userRepositories = repositoryFactory.user;

	// Initialize the services
	const emailService = serviceFactory.EmailService(emailAdapter);
	const userService = serviceFactory.UserService(userRepositories, emailService)
	const idService = serviceFactory.IdService(uuidAdapter);
	const cleanupService = serviceFactory.CleanupService(userService);
	const loginService = serviceFactory.LoginService(userService, passportAdapter, bcryptAdapter);
	const authorizationService = serviceFactory.AuthorizationService(userService, tokenAdapter);

	const services: ServiceInterfaces = {
		userService,
		loginService,
		emailService,
		idService,
		hasher: bcryptAdapter,
		authorizationService
	};

	// Initialize the controllers
	const loginController = controllerFactory.LoginController(loginService);
	const userController = controllerFactory.UserController(bcryptAdapter, userService, loginService, idService, emailService);
	const swaggerAuthController = controllerFactory.SwaggerAuthController(bcryptAdapter, userService, loginService);
	const controllerInstances: ControllersInterfaces = {
		loginController: createRouteController(loginController),
		userController: createRouteController(userController),
		swaggerAuthController: createRouteController(swaggerAuthController),
	};

	createSuperUserIfNotExists(userRepositories, bcryptAdapter, uuidAdapter).then(() => console.log('user initialized'));

	cleanupService.removeUnconfirmedUsers();

	// Initialize the router
	const router = new Router(expressAdapter, services, controllerInstances);
	await router.configureRoutes();

	http.createServer(expressAdapter.getApp()).listen(8000, () => {
		console.log('Server started on port 8000');
	});
});
