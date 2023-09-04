import {HttpRequest, HttpResponse, NextFunction} from "../../domain/interfaces/adapters/server.interface";
import {MiddlewareInterface} from "../../domain/interfaces/adapters/middleware.interface";
import {UserServiceInterface} from "../../domain/interfaces/services/user.service.interface";
import {CustomResponse} from "../error/customResponse";

export function RateLimitMiddleware(userService: UserServiceInterface): MiddlewareInterface{
	const loginAttempts = new Map<string, { count: number, lastAttempt: Date }>();

	return {
		handle: async (req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> => {
			const attempts = loginAttempts.get(req.body.email) || { count: 0, lastAttempt: new Date() };
			if (attempts.count >= 5 && (new Date().getTime() - attempts.lastAttempt.getTime()) < 5 * 60 * 1000) {
				throw new CustomResponse(429, 'Too many login attempts, please try again later.');
			}

			try {
				await next();
				loginAttempts.delete(req.body.email);
			} catch (err) {
				loginAttempts.set(req.body.email, { count: attempts.count + 1, lastAttempt: new Date() });
				throw err;
			}
		}
	}
}
