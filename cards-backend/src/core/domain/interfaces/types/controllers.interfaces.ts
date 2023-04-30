import {LoginControllerInterface} from "../controllers/login.controller.interface";
import {UserControllerInterface} from "../controllers/user.controller.interface";
import {DeckControllerInterface} from "../controllers/deck.controller.interface";

export type ControllersInterfaces = [LoginControllerInterface, UserControllerInterface, DeckControllerInterface];