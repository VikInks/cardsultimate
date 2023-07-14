import { MiddlewareInterface } from "../adapters/middleware.interface";

export type MiddlewaresInterfaces = {
	isAdmin: MiddlewareInterface;
	isSuperUser: MiddlewareInterface;
	isAuthenticated: MiddlewareInterface;
	CheckUserStatus: MiddlewareInterface;
	rateLimitLogin: MiddlewareInterface;
	rateLimitRequest: MiddlewareInterface;
};
