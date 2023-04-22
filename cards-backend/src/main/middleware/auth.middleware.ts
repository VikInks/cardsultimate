import { BaseMiddleware } from "./base.middleware";
import { INextFunction, IRequest, IResponse } from "../../domain/interfaces/requestHandler.interface";
import jwt from "jsonwebtoken";
import {MiddlewareInterface} from "../../domain/interfaces/middleware.interface";

export class AuthMiddleware extends BaseMiddleware implements MiddlewareInterface {
	async handle(req: IRequest, res: IResponse, next: INextFunction): Promise<void> {
		const token = this.getTokenFromCookie(req.cookies, "swagger_token");
		if (token) {
			const secret = process.env.JWT_SECRET;
			if (!secret) throw new Error("No secret provided");
			try {
				req.user = jwt.verify(token, secret);
				next();
			} catch (error) {
				res.status(401).json({ message: "Unauthorized: Invalid token" });
			}
		} else {
			res.status(401).json({ message: "Unauthorized: Token not provided" });
		}
	}
}