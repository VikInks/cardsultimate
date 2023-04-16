import * as dotenv from "dotenv";
import {adapterFactory, createTypedMongoAdapter} from "./main/initializer/adapters.factory";
import {InitDatabase} from "./main/initializer/initDatabase";
import {serviceFactory} from "./main/initializer/services.factory";
import {controllerFactory} from "./main/initializer/controllers.factory";
import {initRepositories} from "./main/initializer/repositories.factory";
import {UserEntitiesInterface} from "./domain/interfaces/entities/user.entities.interface";
import Router from "./main/router/generator/router";
import * as http from "http";
import {middlewareFactory} from "./main/initializer/middleware.factory";
import {MiddlewareCollection} from "./domain/interfaces/middleware.interface";
import {generateSwagger} from "./domain/doc/swagger.doc";

dotenv.config({path: __dirname + '/.env'});

InitDatabase().then((db) => {

	// Initialize the adapters
	const bcryptAdapter = adapterFactory.bcrypt();
	const emailAdapter = adapterFactory.email();
	const expressAdapter = adapterFactory.express();
	const passportAdapter = adapterFactory.passport();
	const uuidAdapter = adapterFactory.uuid();
	const swaggerAdapter = adapterFactory.swagger(expressAdapter.getApp());

	// Initialize the database adapter for user repository
	const mongoAdapter = createTypedMongoAdapter<UserEntitiesInterface>({
		entityName: 'user',
		db: db
	});

	// Initialize the repositories
	const repositories = initRepositories({
		user: mongoAdapter,
	});

	// Initialize the services
	const emailService = serviceFactory.EmailService(emailAdapter);
	const userService = serviceFactory.UserService(repositories.user, emailService)
	const idService = serviceFactory.IdService(uuidAdapter);
	const cleanupService = serviceFactory.CleanupService(userService);
	const loginService = serviceFactory.LoginService(userService, passportAdapter, bcryptAdapter);

	const middlewares: MiddlewareCollection = {
		auth: middlewareFactory.auth(),
		isSuperUser: middlewareFactory.isSuperUser(userService),
		isAdmin: middlewareFactory.isAdmin(userService),
	};

	// Initialize the controllers
	const userController = controllerFactory.UserController(bcryptAdapter, userService, loginService, idService, emailService);
	const loginController = controllerFactory.LoginController(loginService);

	cleanupService.removeUnconfirmedUsers();
	swaggerAdapter.setupSwagger(expressAdapter);
	generateSwagger();

	// Initialize the routers
	Router(expressAdapter, userService, [userController, loginController], middlewares);
	http.createServer(expressAdapter.getApp()).listen(8000, () => {
		console.log('Server started on port 8000');
	});
});

