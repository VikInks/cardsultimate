import {HttpRequest, HttpResponse, NextFunction} from "../adapters/server.interface";

export interface LoginControllerInterface {
	login(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<any>;
	disconnect(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<any>;
}