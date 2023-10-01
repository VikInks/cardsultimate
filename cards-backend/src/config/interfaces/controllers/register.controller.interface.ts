import {HttpRequest, HttpResponse, NextFunction} from "../adapters/server.interface";

export interface RegisterControllerInterface {
    register(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void>;
}