import { MiddlewareInterface } from "../../config/interfaces/adapters/middleware.interface";
import { AuthorizationServiceInterface } from "../../config/interfaces/services/authorization.service.interface";
import {HttpRequest, HttpResponse, NextFunction} from "../../config/interfaces/adapters/server.interface";


export function AdminMiddleware(authService: AuthorizationServiceInterface): MiddlewareInterface {
	return {
		handle: async (req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> => {
			const token = req.cookie["cardsToken"];

			if (!token) {
				res.status(401).send("Access denied. No token provided.");
				return;
			}

			const user = await authService.verifyToken(token);

			if (!user) {
				res.status(401).send("Access denied. Invalid token.");
				return;
			}

			await authService.isAdmin(user);

			next();
		},
	};
}
