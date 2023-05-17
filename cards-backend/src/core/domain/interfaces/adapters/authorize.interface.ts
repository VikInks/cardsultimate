import { UserEntitiesInterface as user} from "../../endpoints/user.entities.interface";
import {HttpRequest, HttpResponse, NextFunction} from "./server.interface";



export interface AuthorizeInterface {
	initialize(): any;
	session(): any;
	use(strategy: any): void;
	authenticate(strategy: string, options?: object): (req: HttpRequest, res: HttpResponse, next: NextFunction) => void;
	serializeUser(fn: (user: user, done: (err: any, id: any) => void) => void): void;
	deserializeUser(fn: (id: any, done: (err: any, user: user) => void) => void): void;
	sign(payload: { role: string; email: string; username: string }): string;
}