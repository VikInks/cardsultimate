import * as dotenv from "dotenv";
import {adapterFactory, createTypedMongoAdapter} from "./core/framework/initializer/adapters.factory";
import {InitDatabase} from "./core/framework/initializer/initDatabase";
import {serviceFactory} from "./core/framework/initializer/services.factory";
import {controllerFactory} from "./core/framework/initializer/controllers.factory";
import {initRepositories} from "./core/framework/initializer/repositories.factory";
import {createSuperUserIfNotExists} from "./dev/createsuperuser";
import { Router } from './core/framework/router/generator/router';
import {middlewareFactory} from "./core/framework/initializer/middleware.factory";
import {utilsFactory} from "./core/framework/initializer/utils.factory";

dotenv.config({path: __dirname + '/.env'});

InitDatabase().then(async (db) => {
	console.log('Database connected');
	console.log(process.env.NODE_ENV == 'development' ? 'Development mode' : 'Production mode');

	// Initialize the adapters
	const bcryptAdapter = adapterFactory.bcrypt();
	const emailAdapter = adapterFactory.email(process.env.NODE_ENV === 'production' ? 'production' : 'development');
	const serverAdapter = adapterFactory.server();
	const tokenAdapter = adapterFactory.token();
	const passportAdapter = adapterFactory.passport(tokenAdapter);
	const uuidAdapter = adapterFactory.uuid();
	const biscuitAdapter = adapterFactory.biscuit();
	const docUiAdapter = adapterFactory.docUi();

	const mongoList = {
		user: 'user',
		deck: 'deck',
		collection: 'collection'
	};

	const adapters: any = {};
	for (const [entityName, collectionName] of Object.entries(mongoList)) {
		adapters[entityName] = createTypedMongoAdapter({
			entityName: entityName,
			collection: await db.getCollection(collectionName)
		});
	}

	const repositoryFactory = initRepositories(adapters);

	const userRepositories = repositoryFactory.user;
	const collectionRepositories = repositoryFactory.collection;
	const deckRepositories = repositoryFactory.deck;

	const deckManagerUtils = utilsFactory.DeckManagerUtility(deckRepositories);

	// Initialize the services
	const emailService = serviceFactory.EmailService(emailAdapter);
	const idService = serviceFactory.IdService(uuidAdapter);
	const userService = serviceFactory.UserService(userRepositories, emailService, bcryptAdapter, idService)
	const cleanupService = serviceFactory.CleanupService(userService);
	const loginService = serviceFactory.LoginService(userService, passportAdapter, bcryptAdapter);
	const authorizationService = serviceFactory.AuthorizationService(userService, tokenAdapter);
	const deckService = serviceFactory.DeckService(deckRepositories, userService, deckManagerUtils);
	const collectionService = serviceFactory.CollectionService(collectionRepositories, userService, idService);

	// Initialize the controllers
	const loginController = controllerFactory.LoginController(loginService);
	const deckController = controllerFactory.DeckController(deckService);
	const userController = controllerFactory.UserController(bcryptAdapter, userService, loginService, idService, emailService, collectionService);
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
	Router(serverAdapter, biscuitAdapter, docUiAdapter, middlewares, [loginController, userController, collectionController, deckController]).then(() => console.log("Routes configured"));

	serverAdapter.start(8000, () => {
		console.log('Server started on port 8000');
	});
});
