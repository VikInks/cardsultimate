import { UserEntitiesInterface as user} from "./endpoints/entities/user.entities.interface";
import {INextFunction, IRequest, IResponse} from "./requestHandler.interface";
import {LocalityInformationsInterface} from "./endpoints/informations/locality.informations.interface";

export interface PassportInterface {
	initialize(): any;
	session(): any;
	use(strategy: any): void;
	authenticate(strategy: string, options?: object): (req: IRequest, res: IResponse, next: INextFunction) => void;
	serializeUser(fn: (user: user, done: (err: any, id: any) => void) => void): void;
	deserializeUser(fn: (id: any, done: (err: any, user: user) => void) => void): void;
	sign(payload: { role: string; locality: LocalityInformationsInterface; email: string; username: string }): string;
}