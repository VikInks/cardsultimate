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
import {WebSocketServer} from "./infrastructure/websocket/websocket.server";

dotenv.config({path: __dirname + '/.env'});

const websocketServer = new WebSocketServer(8081);

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
	const redisAdapter = adapterFactory.redis();
	const axiosAdapter = adapterFactory.axios();

	// Initialize the database user adapter for user repository
	const mongUserAdapter = createTypedMongoAdapter<UserEntitiesInterface>({
		entityName: 'user',
		collection: await db.getCollection('user')
	});

	const mongoDeckAdapter = createTypedMongoAdapter<DeckEntityInterface>({
		entityName: 'deck',
		collection: await db.getCollection('deck')
	});

	const mongoCollectionAdapter = createTypedMongoAdapter<CollectionEntityInterface>({
		entityName: 'collection',
		collection: await db.getCollection('collection')
	});

	const mongoCardAdapter = createTypedMongoAdapter<CollectionEntityInterface>({
		entityName: 'card',
		collection: await db.getCollection('card')
	});

	// Initialize the repositories
	const repositoryFactory = initRepositories({
		user: mongUserAdapter,
		deck: mongoDeckAdapter,
		collection: mongoCollectionAdapter,
		card: mongoCardAdapter
	});

	const userRepositories = repositoryFactory.user;
	const collectionRepositories = repositoryFactory.collection;
	const deckRepositories = repositoryFactory.deck;
	const cardRepositories = repositoryFactory.card;

	// Initialize the services
	const redisService = serviceFactory.RedisService(redisAdapter);
	const emailService = serviceFactory.EmailService(emailAdapter);
	const idService = serviceFactory.IdService(uuidAdapter);
	const userService = serviceFactory.UserService(userRepositories, emailService, bcryptAdapter, idService);
	const loginService = serviceFactory.LoginService(userService, passportAdapter, bcryptAdapter);
	const authorizationService = serviceFactory.AuthorizationService(userService, tokenAdapter);
	const deckService = serviceFactory.DeckService(deckRepositories, userService);
	const collectionService = serviceFactory.CollectionService(collectionRepositories, userService, redisService);
	const cardService = serviceFactory.CardService(cardRepositories, redisService);
	const bulkDataService = serviceFactory.BulkDataService(cardRepositories, axiosAdapter, websocketServer);
	const TimeUpService = serviceFactory.TimeupService(userService, bulkDataService);

	// Initialize the controllers
	const loginController = controllerFactory.LoginController(loginService);
	const deckController = controllerFactory.DeckController(deckService);
	const userController = controllerFactory.UserController(bcryptAdapter, userService, loginService, idService, emailService, collectionService);
	const collectionController = controllerFactory.CollectionController(collectionService, userService, idService);

	// TODO : corriger ici et ajouter la logique de logging à l'application
	function initMiddlewares(authorizationService : any, userService : any, any: any) {
		const factory = middlewareFactory(authorizationService, userService, any);
		return {
			isAdmin: factory.isAdmin(),
			isSuperUser: factory.isSuperUser(),
			isAuthenticated: factory.isAuthenticated(),
			CheckUserStatus: factory.CheckUserStatus(),
			rateLimitLogin: factory.rateLimitLogin(),
			rateLimitRequest: factory.rateLimitRequest(),
			logging: factory.logging()
		};
	}

	const middlewares = initMiddlewares(authorizationService, userService, null);

	await createSuperUserIfNotExists(userRepositories, bcryptAdapter, uuidAdapter).then(() => console.log('user initialized'));

	TimeUpService.removeUnconfirmedUsers();
	TimeUpService.updateCardDatabase();

	// Initialize the router
	Router(serverAdapter, biscuitAdapter, docUiAdapter, middlewares, [loginController, userController, deckController, collectionController]).then(() => console.log("Routes configured"));

	serverAdapter.start(8000, () => {
		console.log('Server started on port 8000');
	});
});
