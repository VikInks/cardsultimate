import {INextFunction, IRequest, IResponse} from "../../domain/interfaces/requestHandler.interface";
import jwt from "jsonwebtoken";

export function AuthMiddleware() {
	return async (req: IRequest, res: IResponse, next: INextFunction): Promise<void> => {
		const authorization = req.headers.authorization;
		if (authorization) {
			const token = authorization.split(" ")[1];
			if (token) {
				const secret = process.env.JWT_SECRET;
				if (!secret) throw new Error('No secret provided');
				try {
					req.user = jwt.verify(token, secret);
					next();
				} catch (error) {
					res.status(401).json({message: 'Unauthorized: Invalid token'});
				}
			} else {
				res.status(401).json({message: 'Unauthorized: Token not provided'});
			}
		} else {
			res.status(401).json({message: 'Unauthorized: No authorization header'});
		}
	}
}