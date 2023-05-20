import * as dotenv from "dotenv";
import {adapterFactory, createTypedMongoAdapter} from "./core/framework/initializer/adapters.factory";
import {InitDatabase} from "./core/framework/initializer/initDatabase";
import {serviceFactory} from "./core/framework/initializer/services.factory";
import {controllerFactory} from "./core/framework/initializer/controllers.factory";
import {initRepositories} from "./core/framework/initializer/repositories.factory";
import {UserEntitiesInterface} from "./core/domain/endpoints/user.entities.interface";
import {createSuperUserIfNotExists} from "./dev/createsuperuser";
import { Router } from './core/framework/router/generator/router';
import {middlewareFactory} from "./core/framework/initializer/middleware.factory";
import {CollectionEntityInterface} from "./core/domain/endpoints/collection/collection.entity.interface";

dotenv.config({path: __dirname + '/.env'});

InitDatabase().then(async (db) => {
	console.log('Database connected');

	// Initialize the adapters
	const bcryptAdapter = adapterFactory.bcrypt();
	const emailAdapter = adapterFactory.email(process.env.NODE_ENV === 'production' ? 'production' : 'development');
	const serverAdapter = adapterFactory.server();
	const tokenAdapter = adapterFactory.token();
	const passportAdapter = adapterFactory.passport(tokenAdapter);
	const uuidAdapter = adapterFactory.uuid();
	const biscuitAdapter = adapterFactory.biscuit();
	const docUiAdapter = adapterFactory.docUi();

	// Initialize the database user adapter for user repository
	const mongUserAdapter = createTypedMongoAdapter<UserEntitiesInterface>({
		entityName: 'user',
		collection: await db.getCollection('user')
	});

	const mongCollectionAdapter = createTypedMongoAdapter<CollectionEntityInterface>({
		entityName: 'collection',
		collection: await db.getCollection('collection')
	});

	// Initialize the repositories
	const repositoryFactory = initRepositories({
		user: mongUserAdapter,
		collection: mongCollectionAdapter
	});
	const userRepositories = repositoryFactory.user;
	const collectionRepositories = repositoryFactory.collection;

	// Initialize the services
	const emailService = serviceFactory.EmailService(emailAdapter);
	const idService = serviceFactory.IdService(uuidAdapter);
	const userService = serviceFactory.UserService(userRepositories, emailService, bcryptAdapter, idService)
	const cleanupService = serviceFactory.CleanupService(userService);
	const loginService = serviceFactory.LoginService(userService, passportAdapter, bcryptAdapter);
	const authorizationService = serviceFactory.AuthorizationService(userService, tokenAdapter);
	const collectionService = serviceFactory.CollectionService(collectionRepositories, userService, idService);

	// Initialize the controllers
	const loginController = controllerFactory.LoginController(loginService);
	const userController = controllerFactory.UserController(bcryptAdapter, userService, loginService, idService, emailService);
	const collectionController = controllerFactory.CollectionController(collectionService, userService, idService);

	const middlewaresFactory = middlewareFactory(authorizationService, userService);
	const middlewares = {
		isAdmin: middlewaresFactory.isAdmin(),
		isSuperUser: middlewaresFactory.isSuperUser(),
		isAuthenticated: middlewaresFactory.isAuthenticated(),
		CheckUserStatus: middlewaresFactory.CheckUserStatus(),
		rateLimitLogin: middlewaresFactory.rateLimitLogin(),
		rateLimitRequest: middlewaresFactory.rateLimitRequest(),
	}

	await createSuperUserIfNotExists(userRepositories, bcryptAdapter, uuidAdapter).then(() => console.log('user initialized'));

	cleanupService.removeUnconfirmedUsers();

	// Initialize the router
	Router(serverAdapter, biscuitAdapter, docUiAdapter, middlewares, [loginController, userController, collectionController]).then(() => console.log("Routes configured"));

	serverAdapter.start(8000, () => {
		console.log('Server started on port 8000');
	});
});
