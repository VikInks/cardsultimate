import * as dotenv from "dotenv";
import {InitDatabase} from "./framework/initializer/initDatabase";
import {adapterFactory, createTypedMongoAdapter} from "./framework/initializer/adapters.factory";
import {UserEntitiesInterface} from "./domain/user.entities.interface";
import {DeckEntityInterface} from "./domain/decks/deck.entity.interface";
import {CollectionEntityInterface} from "./domain/collection/collection.entity.interface";
import {initRepositories} from "./framework/initializer/repositories.factory";
import {serviceFactory} from "./framework/initializer/services.factory";
import {controllerFactory} from "./framework/initializer/controllers.factory";
import {middlewareFactory} from "./framework/initializer/middleware.factory";
import {createSuperUserIfNotExists} from "./dev/createsuperuser";
import {Router} from "./framework/router/generator/router";

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

	const mongoDeckAdapter = createTypedMongoAdapter<DeckEntityInterface>({
		entityName: 'deck',
		collection: await db.getCollection('deck')
	});

	const mongCollectionAdapter = createTypedMongoAdapter<CollectionEntityInterface>({
		entityName: 'collection',
		collection: await db.getCollection('collection')
	});

	// Initialize the repositories
	const repositoryFactory = initRepositories({
		user: mongUserAdapter,
		deck: mongoDeckAdapter,
		collection: mongCollectionAdapter
	});

	const userRepositories = repositoryFactory.user;
	const collectionRepositories = repositoryFactory.collection;
	const deckRepositories = repositoryFactory.deck;

	// Initialize the services
	const emailService = serviceFactory.EmailService(emailAdapter);
	const idService = serviceFactory.IdService(uuidAdapter);
	const userService = serviceFactory.UserService(userRepositories, emailService, bcryptAdapter, idService)
	const cleanupService = serviceFactory.TimeupService(userService);
	const loginService = serviceFactory.LoginService(userService, passportAdapter, bcryptAdapter);
	const authorizationService = serviceFactory.AuthorizationService(userService, tokenAdapter);
	const deckService = serviceFactory.DeckService(deckRepositories, userService);
	const collectionService = serviceFactory.CollectionService(collectionRepositories, userService, idService);

	// Initialize the controllers
	const loginController = controllerFactory.LoginController(loginService);
	const deckController = controllerFactory.DeckController(deckService);
	const userController = controllerFactory.UserController(bcryptAdapter, userService, loginService, idService, emailService, collectionService);
	const collectionController = controllerFactory.CollectionController(collectionService, userService, idService);

	const middlewaresFactory = middlewareFactory(authorizationService, userService, );
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
	Router(serverAdapter, biscuitAdapter, docUiAdapter, middlewares, [loginController, userController, deckController, collectionController]).then(() => console.log("Routes configured"));

	serverAdapter.start(8000, () => {
		console.log('Server started on port 8000');
	});
});
