
import {HttpRequest, HttpResponse, NextFunction} from "./server.interface";
import {UserEntitiesInterface} from "../../../domain/user.entities.interface";



export interface AuthorizeInterface {
	initialize(): any;
	session(): any;
	use(strategy: any): void;
	authenticate(strategy: string, options?: object): (req: HttpRequest, res: HttpResponse, next: NextFunction) => void;
	serializeUser(fn: (user: UserEntitiesInterface, done: (err: any, id: any) => void) => void): void;
	deserializeUser(fn: (id: any, done: (err: any, user: UserEntitiesInterface) => void) => void): void;
	sign(payload: { role: string; email: string; username: string }): string;
}