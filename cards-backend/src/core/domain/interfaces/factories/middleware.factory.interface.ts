import {MiddlewareInterface} from "../adapters/middleware.interface";

export interface MiddlewareFactoryInterface {
	isAdmin(): MiddlewareInterface;
	isSuperUser(): MiddlewareInterface;
}
