import {HttpRequest, HttpResponse, NextFunction} from "./server.interface";

export interface MiddlewareInterface {
	handle(req: HttpRequest, res: HttpResponse, next: NextFunction): void;
}


