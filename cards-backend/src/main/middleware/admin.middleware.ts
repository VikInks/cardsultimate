import { BaseMiddleware } from "./base.middleware";
import { INextFunction, IRequest, IResponse } from "../../domain/interfaces/requestHandler.interface";
import { UserServiceInterface } from "../../domain/interfaces/services/user.service.interface";
import { UserEntitiesInterface } from "../../domain/interfaces/endpoints/entities/user.entities.interface";
import {MiddlewareInterface} from "../../domain/interfaces/middleware.interface";

export class AdminMiddleware extends BaseMiddleware implements MiddlewareInterface {
	constructor(private userService: UserServiceInterface) {
		super();
	}

	async handle(req: IRequest, res: IResponse, next: INextFunction): Promise<void> {
		const user = req.user as UserEntitiesInterface;
		if (user) {
			await this.userService.findByEmail(user.email).then((userExist) => {
				if (!userExist) throw new Error("User not found");
				userExist.role === "admin" ? next() : res.status(403).json({ message: "Forbidden: Only Admins have access" });
			});
		} else {
			res.status(401).json({ message: "Unauthorized: User not authenticated" });
		}
	}
}
