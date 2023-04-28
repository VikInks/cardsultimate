import {httpNext, httpReq, httpRes, ServerType} from "../../domain/interfaces/adapters/request.handler.interface";
import {UserServiceInterface} from "../../domain/interfaces/services/user.service.interface";
import {CustomError} from "../error/customError";
import {MiddlewareInterface} from "../../domain/interfaces/adapters/middleware.interface";

export function CheckUserStatusMiddleware(userService: UserServiceInterface): MiddlewareInterface{

	return {
		handle: async (req: httpReq, res: httpRes, next: httpNext): Promise<void> => {
			if (!req.user) {
				throw new CustomError(401, 'Unauthorized');
			}

			const userEmail = req.user.email;
			const user = await userService.findByEmail(userEmail);

			if (!user) {
				throw new CustomError(404, 'User not found');
			}

			if (user.banned) {
				throw new CustomError(403, 'User is banned');
			}

			if (user.archive) {
				throw new CustomError(403, 'User is archived');
			}

			next();
		}
	}
}
