import {HttpRequest, HttpResponse, NextFunction} from "../adapters/server.interface";

export interface RegisterServiceInterface {
    register(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void>;
}