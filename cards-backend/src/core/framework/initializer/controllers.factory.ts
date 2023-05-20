import { UserController } from "../../application/controllers/user.controller";
import { LoginController } from "../../application/controllers/login.controller";
import {CollectionController} from "../../application/controllers/collection.controller";


type ControllerClassMap = {
	UserController: UserController;
	LoginController: LoginController;
	CollectionController: CollectionController;
};

type ControllerConstructorMap = {
	[K in keyof ControllerClassMap]: new (...args: any[]) => ControllerClassMap[K];
};

const controllerClasses: ControllerConstructorMap = {
	UserController,
	LoginController,
	CollectionController,
};

type ControllerInstanceMap<T> = {
	[K in keyof T]: T[K] extends new (...args: infer P) => infer R ? (...args: P) => R : never;
};

function createControllerFactory<T extends Record<string, new (...args: any[]) => any>>(controllerClasses: T): ControllerInstanceMap<T> {
	const controllerFactory: Partial<ControllerInstanceMap<T>> = {};

	for (const key in controllerClasses) {
		controllerFactory[key as keyof T] = ((...args: any[]) => {
			const controllerClass = controllerClasses[key as keyof T];
			return new controllerClass(...args);
		}) as any;
	}

	return controllerFactory as ControllerInstanceMap<T>;
}

export const controllerFactory = createControllerFactory(controllerClasses);
