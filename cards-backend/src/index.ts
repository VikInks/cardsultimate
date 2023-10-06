import * as dotenv from "dotenv";
import {adapterFactory, createTypedMongoAdapter} from "./framework/initializer/adapters.factory";
import {InitDatabase} from "./framework/initializer/initDatabase";
import {serviceFactory} from "./framework/initializer/services.factory";
import {controllerFactory} from "./framework/initializer/controllers.factory";
import {initRepositories} from "./framework/initializer/repositories.factory";
import {createSuperUserIfNotExists} from "./config/dev/createsuperuser";
import { Router } from './framework/router/generator/router';
import {middlewareFactory} from "./framework/initializer/middleware.factory";
import {utilsFactory} from "./framework/initializer/utils.factory";
import {DiscordNotifier} from "./config/utils/discord.notifier";
import {ErrorHandlerMiddlewareFactory} from "./framework/middleware/error.handler.middleware";

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
	const discordAdapter = adapterFactory.discord();
	const axiosAdapter = adapterFactory.axios();


	const mongoList = {
		user: 'user',
		deck: 'deck',
		collection: 'collection',
		card: 'card'
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
	const cardRepositories = repositoryFactory.card;

	const deckManagerUtils = utilsFactory.DeckManagerUtility(deckRepositories);

	// Initialize the services
	const emailService = serviceFactory.EmailService(emailAdapter);
	const idService = serviceFactory.IdService(uuidAdapter);
	const userService = serviceFactory.UserService(userRepositories, emailService, bcryptAdapter, idService)
	const timeupService = serviceFactory.TimeupService(userService);
	const loginService = serviceFactory.LoginService(userService, passportAdapter, bcryptAdapter);
	const authorizationService = serviceFactory.AuthorizationService(userService, tokenAdapter);
	const deckService = serviceFactory.DeckService(deckRepositories, userService, deckManagerUtils);
	const collectionService = serviceFactory.CollectionService(collectionRepositories, userService, idService);
	const discordService = serviceFactory.DiscordService(discordAdapter);
	const redisService = serviceFactory.RedisService();
	const bulkService = serviceFactory.BulkDataService(cardRepositories, redisService, axiosAdapter);
	const cardService = serviceFactory.CardService(cardRepositories, bulkService, redisService);

	await cardService.initializeCards().then(async () => {
		timeupService.refreshCardDatabase();
	});

	// Initialize the controllers
	const loginController = controllerFactory.LoginController(loginService);
	const deckController = controllerFactory.DeckController(deckService);
	const userController = controllerFactory.UserController(bcryptAdapter, userService, loginService, idService, emailService, collectionService);
	const collectionController = controllerFactory.CollectionController(collectionService, userService, idService);

	// initialize connexion to discord
	await discordService.initialize(process.env.DISCORD_TOKEN!);
	const discordNotifier = new DiscordNotifier(discordAdapter);
	const errorHandlerMiddleware = ErrorHandlerMiddlewareFactory(discordNotifier);

	// Initialize the middlewares
	const middlewaresFactory = middlewareFactory(authorizationService, userService);
	const middlewares = {
		isAdmin: middlewaresFactory.isAdmin(),
		isSuperUser: middlewaresFactory.isSuperUser(),
		isAuthenticated: middlewaresFactory.isAuthenticated(),
		CheckUserStatus: middlewaresFactory.CheckUserStatus(),
		rateLimitLogin: middlewaresFactory.rateLimitLogin(),
		rateLimitRequest: middlewaresFactory.rateLimitRequest()
	}

	await createSuperUserIfNotExists(userRepositories, bcryptAdapter, uuidAdapter).then(() => console.log('user initialized'));

	timeupService.removeUnconfirmedUsers();

	// Initialize the router
	Router(serverAdapter, biscuitAdapter, docUiAdapter, middlewares, errorHandlerMiddleware, [loginController, userController, collectionController, deckController]).then(() => console.log("Routes configured"));

	serverAdapter.start(8000, () => {
		console.log('Server started on port 8000');
	});
});
