import { MiddlewareInterface } from "../adapters/middleware.interface";

/**
 * MiddlewaresInterfaces
 * @description This type is used to define the middlewares that will be used in the application.
 * @property {MiddlewareInterface} isAdmin - This middleware checks if the user is an admin.
 * @property {MiddlewareInterface} isSuperUser - This middleware checks if the user is a super user.
 * @property {MiddlewareInterface} isAuthenticated - This middleware checks if the user is authenticated.
 * @property {MiddlewareInterface} CheckUserStatus - This middleware checks if the user is active.
 * @property {MiddlewareInterface} rateLimitLogin - This middleware checks if the user is active.
 * @property {MiddlewareInterface} rateLimitRequest - This middleware checks if the user is active.
 * @property {MiddlewareInterface} logging - This middleware checks if the user is active.
 */
export type MiddlewaresInterfaces = {
	isAdmin: MiddlewareInterface;
	isSuperUser: MiddlewareInterface;
	isAuthenticated: MiddlewareInterface;
	CheckUserStatus: MiddlewareInterface;
	rateLimitLogin: MiddlewareInterface;
	rateLimitRequest: MiddlewareInterface;
	logging: MiddlewareInterface;
};
