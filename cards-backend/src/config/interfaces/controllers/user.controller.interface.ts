import {HttpRequest, HttpResponse, NextFunction} from "../adapters/server.interface";


export interface UserControllerInterface {
    register(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void>;
    confirmAccount(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void>;
    findByEmail(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void>;
    update(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void>;
    handleUserArchive(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void>;
    handleUserBan(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void>;
    findByUsername(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void>;
}
