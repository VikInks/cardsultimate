import { MiddlewareInterface } from "../../domain/interfaces/adapters/middleware.interface";
import { AuthorizationServiceInterface } from "../../domain/interfaces/services/authorization.service.interface";
import { INextFunction, IRequest, IResponse } from "../../domain/interfaces/adapters/requestHandler.interface";
import { MiddlewareFactoryInterface } from "../../domain/interfaces/factories/middleware.factory.interface";

export function middlewareFactory(authService: AuthorizationServiceInterface): MiddlewareFactoryInterface {
	return {
		isAdmin: (): MiddlewareInterface => {
			return {
				handle: async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
					if (await authService.isAdmin(req.user)) {
						next();
					} else {
						res.status(403).send("Access denied. Insufficient permissions.");
					}
				},
			};
		},
		isSuperUser: (): MiddlewareInterface => {
			return {
				handle: async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
					if (await authService.isSuperUser(req.user)) {
						next();
					} else {
						res.status(403).send("Access denied. Insufficient permissions.");
					}
				},
			};
		},
	};
}
