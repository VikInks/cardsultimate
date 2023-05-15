import {NextFunction, Request, Response} from "./server.interface";

export interface MiddlewareInterface {
	handle(req: Request, res: Response, next: NextFunction): void;
}


