import {Request, Response, NextFunction} from "../adapters/server.interface";

export interface LoginControllerInterface {
	login(req: Request, res: Response, next: NextFunction): Promise<any>;
	disconnect(req: Request, res: Response, next: NextFunction): Promise<any>;
}