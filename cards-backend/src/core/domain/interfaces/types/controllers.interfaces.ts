import {LoginControllerInterface} from "../controllers/login.controller.interface";
import {UserControllerInterface} from "../controllers/user.controller.interface";

export type ControllersInterfaces = {
	[key: string]: any;
	loginController: LoginControllerInterface;
	userController: UserControllerInterface;
};