import {INextFunction, IRequest, IResponse} from "../../domain/interfaces/requestHandler.interface";
import { UserServiceInterface } from "../../domain/interfaces/services/user.service.interface";
import { UserEntitiesInterface } from "../../domain/interfaces/entities/user.entities.interface";
import jwt from "jsonwebtoken";

export function SuperuserMiddleware(userService: UserServiceInterface) {
	return async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
		const authorization = req.headers.authorization;
		const user = req.user as UserEntitiesInterface;
		if (user) {
			const token = authorization.split(" ")[1];
			const secret = process.env.JWT_SECRET;
			if (!secret) throw new Error('No secret provided');
			try {
				req.user = jwt.verify(token, secret);
			} catch (error) {
				res.status(401).json({ message: "Unauthorized: Invalid token" });
			}
			await userService.findByEmail(user.email).then((userExist) => {
				userExist.role === "superuser" ? next() : res.status(403).json({ message: "Forbidden: Only SuperUser have access" });
			});
		} else {
			res.status(401).json({ message: "Unauthorized: User not authenticated" });
		}
	};
}
