import { MiddlewareInterface } from "../../domain/interfaces/adapters/middleware.interface";
import { AuthorizationServiceInterface } from "../../domain/interfaces/services/authorization.service.interface";
import { AdminMiddleware } from "../middleware/admin.middleware";
import { SuperuserMiddleware } from "../middleware/superuser.middleware";
import { AuthMiddleware} from "../middleware/auth.middleware";
import { CheckUserStatusMiddleware } from "../middleware/user.status.middleware";
import { UserServiceInterface } from "../../domain/interfaces/services/user.service.interface";
import { rateLimitLoginMiddleware } from "../middleware/rate.limit.login.middleware";

export function middlewareFactory(authService: AuthorizationServiceInterface, userService: UserServiceInterface): {
	isSuperUser: () => MiddlewareInterface;
	isAdmin: () => MiddlewareInterface;
	isAuthenticated: () => MiddlewareInterface;
	CheckUserStatus: () => MiddlewareInterface;
	rateLimitLogin: () => MiddlewareInterface;
} {
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
		}
	};
}
