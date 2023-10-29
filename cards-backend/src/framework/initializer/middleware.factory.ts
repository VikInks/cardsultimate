import { MiddlewareInterface } from "../../config/interfaces/adapters/middleware.interface";
import { AuthorizationServiceInterface } from "../../config/interfaces/services/authorization.service.interface";
import { AdminMiddleware } from "../middleware/admin.middleware";
import { SuperuserMiddleware } from "../middleware/superuser.middleware";
import { AuthMiddleware} from "../middleware/auth.middleware";
import { CheckUserStatusMiddleware } from "../middleware/user.status.middleware";
import { UserServiceInterface } from "../../config/interfaces/services/user.service.interface";
import { rateLimitLoginMiddleware } from "../middleware/rate.limit.login.middleware";
import {rateLimitRequestMiddleware} from "../middleware/rate.limit.request.middleware";
import {loggingMiddleware} from "../middleware/logging.middleware";
import {WinstonAdapterInterface} from "../../config/interfaces/adapters/winston.adapter.interface";

type middlewares = {
	isSuperUser: () => MiddlewareInterface;
	isAdmin: () => MiddlewareInterface;
	isAuthenticated: () => MiddlewareInterface;
	CheckUserStatus: () => MiddlewareInterface;
	rateLimitLogin: () => MiddlewareInterface;
	rateLimitRequest: () => MiddlewareInterface;
	logging: () => MiddlewareInterface;
};

export function middlewareFactory(
	authService: AuthorizationServiceInterface,
	userService: UserServiceInterface,
	loggerAdapter: WinstonAdapterInterface
	): middlewares {
	return {
		isAdmin: (): MiddlewareInterface => {
			return AdminMiddleware(authService);
		},
		isSuperUser: (): MiddlewareInterface => {
			return SuperuserMiddleware(authService);
		},
		isAuthenticated: (): MiddlewareInterface => {
			return AuthMiddleware(authService);
		},
		CheckUserStatus: (): MiddlewareInterface => {
			return CheckUserStatusMiddleware(userService);
		},
		rateLimitLogin: (): MiddlewareInterface => {
			return rateLimitLoginMiddleware(userService);
		},
		rateLimitRequest: (): MiddlewareInterface => {
			return rateLimitRequestMiddleware();
		},
		logging: (): MiddlewareInterface => {
			return loggingMiddleware(loggerAdapter);
		}
	};
}
