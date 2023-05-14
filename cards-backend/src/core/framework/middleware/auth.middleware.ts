import {AuthorizationServiceInterface} from "../../domain/interfaces/services/authorization.service.interface";
import {MiddlewareInterface} from "../../domain/interfaces/adapters/middleware.interface";

export function AuthMiddleware(authService: AuthorizationServiceInterface): MiddlewareInterface {
	return {
		handle: async (req: any, res: any, next: any): Promise<void> => {
			const token = req.cookies["cardsToken"];

			if (!token) {
				res.status(401).send("Access denied. No token provided.");
				return;
			}

			const user = await authService.verifyToken(token);

			if (!user) {
				res.status(401).send("Access denied. Invalid token.");
				return;
			}

			req.user = user;
			next();
		},
	};
}