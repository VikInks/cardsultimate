import * as dotenv from "dotenv";
import {adapterFactory, createTypedMongoAdapter} from "./core/framework/initializer/adapters.factory";
import {InitDatabase} from "./core/framework/initializer/initDatabase";
import {serviceFactory} from "./core/framework/initializer/services.factory";
import {controllerFactory} from "./core/framework/initializer/controllers.factory";
import {initRepositories} from "./core/framework/initializer/repositories.factory";
import {UserEntitiesInterface} from "./core/domain/endpoints/user.entities.interface";
import * as http from "http";
import {createSuperUserIfNotExists} from "./dev/createsuperuser";
import { Router } from './core/framework/router/generator/router';
import {middlewareFactory} from "./core/framework/initializer/middleware.factory";
import {DeckEntityInterface} from "./core/domain/endpoints/decks/deck.entity.interface";

dotenv.config({path: __dirname + '/.env'});

InitDatabase().then(async (db) => {
	console.log('Database connected');

	// Initialize the adapters
	const bcryptAdapter = adapterFactory.bcrypt();
	const emailAdapter = adapterFactory.email(process.env.NODE_ENV === 'production' ? 'production' : 'development');
	const expressAdapter = adapterFactory.express();
	const tokenAdapter = adapterFactory.token();
	const passportAdapter = adapterFactory.passport(tokenAdapter);
	const uuidAdapter = adapterFactory.uuid();

	// Initialize the database user adapter for user repository
	const mongUserAdapter = createTypedMongoAdapter<UserEntitiesInterface>({
		entityName: 'user',
		collection: await db.getCollection('user')
	});

	const mongoDeckAdapter = createTypedMongoAdapter<DeckEntityInterface>({
		entityName: 'deck',
		collection: await db.getCollection('deck')
	});

	// Initialize the repositories
	const repositoryFactory = initRepositories({
		user: mongUserAdapter,
		deck: mongoDeckAdapter
	});

	const userRepositories = repositoryFactory.user;
	const deckRepositories = repositoryFactory.deck;

	// Initialize the services
	const emailService = serviceFactory.EmailService(emailAdapter);
	const idService = serviceFactory.IdService(uuidAdapter);
	const userService = serviceFactory.UserService(userRepositories, emailService, bcryptAdapter, idService)
	const cleanupService = serviceFactory.CleanupService(userService);
	const loginService = serviceFactory.LoginService(userService, passportAdapter, bcryptAdapter);
	const authorizationService = serviceFactory.AuthorizationService(userService, tokenAdapter);
	const deckService = serviceFactory.DeckService(deckRepositories, userService);

	// Initialize the controllers
	const loginController = controllerFactory.LoginController(loginService);
	const userController = controllerFactory.UserController(bcryptAdapter, userService, loginService, idService, emailService);
	const deckController = controllerFactory.DeckController(deckService);

	const middlewaresFactory = middlewareFactory(authorizationService, userService);
	const middlewares = {
		isAdmin: middlewaresFactory.isAdmin(),
		isSuperUser: middlewaresFactory.isSuperUser(),
		isAuthenticated: middlewaresFactory.isAuthenticated(),
		CheckUserStatus: middlewaresFactory.CheckUserStatus(),
	}

	await createSuperUserIfNotExists(userRepositories, bcryptAdapter, uuidAdapter).then(() => console.log('user initialized'));

	cleanupService.removeUnconfirmedUsers();

	// Initialize the router
	Router(expressAdapter, middlewares, [loginController, userController, deckController]).then(() => console.log("Routes configured"));

	http.createServer(expressAdapter.getApp()).listen(8000, () => {
		console.log('Server started on port 8000');
	});
});
