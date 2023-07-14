import {LoginControllerInterface} from "../controllers/login.controller.interface";
import {UserControllerInterface} from "../controllers/user.controller.interface";
import {DeckControllerInterface} from "../controllers/deck.controller.interface";
import {CollectionControllerInterface} from "../controllers/collection.controller.interface";

export type ControllersInterfaces = [LoginControllerInterface, UserControllerInterface, CollectionControllerInterface, DeckControllerInterface];