import { UserEntitiesInterface as user} from "../../endpoints/user.entities.interface";
import {httpNext, httpReq, httpRes} from "./request.handler.interface";

export interface AuthorizeInterface {
	initialize(): any;
	session(): any;
	use(strategy: any): void;
	authenticate(strategy: string, options?: object): (req: httpReq, res: httpRes, next: httpNext) => void;
	serializeUser(fn: (user: user, done: (err: any, id: any) => void) => void): void;
	deserializeUser(fn: (id: any, done: (err: any, user: user) => void) => void): void;
	sign(payload: { role: string; email: string; username: string }): string;
}