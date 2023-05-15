import {Request, Response, NextFunction} from "../adapters/server.interface";

export interface UserControllerInterface {
    register(req: Request, res: Response, next: NextFunction): Promise<void>;
    confirmAccount(req: Request, res: Response, next: NextFunction): Promise<void>;
    findByEmail(req: Request, res: Response, next: NextFunction): Promise<void>;
    update(req: Request, res: Response, next: NextFunction): Promise<void>;
    handleUserArchive(req: Request, res: Response, next: NextFunction): Promise<void>;
    handleUserBan(req: Request, res: Response, next: NextFunction): Promise<void>;
    findByUsername(req: Request, res: Response, next: NextFunction): Promise<void>;
}
