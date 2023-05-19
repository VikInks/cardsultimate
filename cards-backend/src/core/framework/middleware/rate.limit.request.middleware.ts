import {HttpRequest, HttpResponse, NextFunction} from "../../domain/interfaces/adapters/server.interface";
import {MiddlewareInterface} from "../../domain/interfaces/adapters/middleware.interface";
import {CustomError} from "../error/customError";

export function rateLimitRequestMiddleware(maxAttempts: number = 50, timeFrame: number = 60 * 60 * 1000, banTime: number = 5 * 60 * 1000): MiddlewareInterface {
	const attempts = new Map<string, { count: number, lastAttempt: Date, bannedUntil: Date }>();

	return {
		handle: async (req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> => {
			const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || "").toString();
			let entry = attempts.get(ip);


			const now = new Date();
			if (entry) {
				if (entry.bannedUntil && entry.bannedUntil > now) {
					throw new CustomError(429, "Too many bad requests from this IP");
				}

				if ((now.getTime() - entry.lastAttempt.getTime()) > timeFrame) {
					entry.count = 0;
				}
			}

			try {
				await next();
			} catch (error) {
				if (!entry) {
					entry = {count: 1, lastAttempt: now, bannedUntil: new Date(0)};
					attempts.set(ip, entry);
				} else {
					entry.count += 1;
				}

				if (entry?.count > maxAttempts) {
					entry.bannedUntil = new Date(now.getTime() + banTime);
					throw new CustomError(429, "Too many requests from this IP");
				}
			}

			if (entry) {
				entry.lastAttempt = now;
			}
		}
	}
}
