import {HttpRequest, HttpResponse, NextFunction} from "../../config/interfaces/adapters/server.interface";
import {MiddlewareInterface} from "../../config/interfaces/adapters/middleware.interface";
import {UserServiceInterface} from "../../config/interfaces/services/user.service.interface";
import {CustomResponse} from "../error/customResponse";

export function rateLimitLoginMiddleware(userService: UserServiceInterface): MiddlewareInterface{
	const loginAttempts = new Map<string, { count: number, lastAttempt: Date, lockedUntil: Date }>();

	return {
		handle: async (req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> => {
			const now = new Date();
			const attempts = loginAttempts.get(req.body.email) || { count: 0, lastAttempt: now, lockedUntil: new Date(0) };

			if (attempts.lockedUntil > now) {
				throw new CustomResponse(429, 'Too many login attempts, please try again later.');
			}

			try {
				await next();

				loginAttempts.set(req.body.email, { count: 0, lastAttempt: now, lockedUntil: new Date(0) });
			} catch (err) {
				const newAttemptsCount = attempts.count + 1;

				if (newAttemptsCount >= 5) {
					const lockedUntil = new Date(now.getTime() + 5 * 60 * 1000);
					loginAttempts.set(req.body.email, { count: newAttemptsCount, lastAttempt: now, lockedUntil });
				} else {
					loginAttempts.set(req.body.email, { count: newAttemptsCount, lastAttempt: now, lockedUntil: attempts.lockedUntil });
				}

				throw err;
			}
		}
	}
}
