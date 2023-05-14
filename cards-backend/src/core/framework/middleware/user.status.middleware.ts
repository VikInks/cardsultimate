import {httpNext, httpReq, httpRes} from "../../domain/interfaces/adapters/request.handler.interface";
import {UserServiceInterface} from "../../domain/interfaces/services/user.service.interface";
import {CustomError} from "../error/customError";
import {MiddlewareInterface} from "../../domain/interfaces/adapters/middleware.interface";

export function CheckUserStatusMiddleware(userService: UserServiceInterface): MiddlewareInterface{

	return {
		handle: async (req: httpReq, res: httpRes, next: httpNext): Promise<void> => {
			const userEmail = req.body.email;
			const user = await userService.findByEmail(userEmail);

			if (!user) {
				throw new CustomError(404, 'User not found');
			}

			if (user.banned) {
				throw new CustomError(403, 'User is banned. Please contact an administrator for more information or see the FAQ.');
			}

			if (user.archive) {
				throw new CustomError(403, 'User is archived. Please contact an administrator for more information or see the FAQ.');
			}

			next();
		}
	}
}
