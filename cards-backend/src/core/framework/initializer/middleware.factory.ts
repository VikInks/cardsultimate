import { MiddlewareInterface } from "../../domain/interfaces/adapters/middleware.interface";
import { AuthorizationServiceInterface } from "../../domain/interfaces/services/authorization.service.interface";
import { AdminMiddleware } from "../middleware/admin.middleware";
import { SuperuserMiddleware } from "../middleware/superuser.middleware";
import {AuthMiddleware} from "../middleware/auth.middleware";

export function middlewareFactory(authService: AuthorizationServiceInterface): {
	isSuperUser: () => MiddlewareInterface;
	isAdmin: () => MiddlewareInterface;
	isAuthenticated: () => MiddlewareInterface
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
		}
	};
}
