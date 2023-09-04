import {UserServiceInterface} from "../../domain/interfaces/services/user.service.interface";
import {CustomResponse} from "../error/customResponse";
import {MiddlewareInterface} from "../../domain/interfaces/adapters/middleware.interface";
import {NextFunction, HttpRequest, HttpResponse} from "../../domain/interfaces/adapters/server.interface";

export function CheckUserStatusMiddleware(userService: UserServiceInterface): MiddlewareInterface{

	return {
		handle: async (req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> => {
			if(!req.user?.email) {
				throw new CustomResponse(401, 'Access denied. No token provided.');
			}
			const userEmail = req.user.email;
			const user = await userService.findByEmail(userEmail);

			if (!user) {
				throw new CustomResponse(404, 'User not found');
			}

			if (user.banned) {
				throw new CustomResponse(403, 'User is banned. Please contact an administrator for more information or see the FAQ.');
			}

			if (user.archive) {
				throw new CustomResponse(403, 'User is archived. Please contact an administrator for more information or see the FAQ.');
			}

			next();
		}
	}
}
