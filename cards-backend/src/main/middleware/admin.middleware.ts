import { IRequest, IResponse, INextFunction } from "../../domain/interfaces/requestHandler.interface";
import { BaseMiddleware } from "./base.middleware";

export class AdminMiddleware extends BaseMiddleware {
	public async handle(req: IRequest, res: IResponse, next: INextFunction): Promise<void> {
		const token = req.cookies.token;

		if (!token) {
			res.status(401).send("Access denied. No token provided.");
			return;
		}

		const user = await this.getUserFromToken(token);

		if (!user) {
			res.status(401).send("Access denied. Invalid token.");
			return;
		}

		if (!(await this.authorizationService.isAdmin(user))) {
			res.status(403).send("Access denied. Insufficient permissions.");
			return;
		}

		next();
	}
}
