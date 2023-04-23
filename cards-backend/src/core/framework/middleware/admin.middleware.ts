import { MiddlewareInterface } from "../../domain/interfaces/adapters/middleware.interface";
import { AuthorizationServiceInterface } from "../../domain/interfaces/services/authorization.service.interface";
import { INextFunction, IRequest, IResponse } from "../../domain/interfaces/adapters/requestHandler.interface";

export function AdminMiddleware(authService: AuthorizationServiceInterface): MiddlewareInterface {
	return {
		handle: async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
			const token = req.cookies.token;

			if (!token) {
				res.status(401).send("Access denied. No token provided.");
				return;
			}

			const user = await authService.verifyToken(token);

			if (!user) {
				res.status(401).send("Access denied. Invalid token.");
				return;
			}

			if (!(await authService.isAdmin(user))) {
				res.status(403).send("Access denied. Insufficient permissions.");
				return;
			}

			next();
		},
	};
}
