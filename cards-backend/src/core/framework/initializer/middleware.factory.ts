import { MiddlewareInterface } from "../../domain/interfaces/adapters/middleware.interface";
import { AuthorizationServiceInterface } from "../../domain/interfaces/services/authorization.service.interface";
import { MiddlewareFactoryInterface } from "../../domain/interfaces/factories/middleware.factory.interface";
import { AdminMiddleware } from "../middleware/admin.middleware";
import { SuperuserMiddleware } from "../middleware/superuser.middleware";

export function middlewareFactory(authService: AuthorizationServiceInterface): MiddlewareFactoryInterface {
	return {
		isAdmin: (): MiddlewareInterface => {
			return AdminMiddleware(authService);
		},
		isSuperUser: (): MiddlewareInterface => {
			return SuperuserMiddleware(authService);
		},
	};
}
