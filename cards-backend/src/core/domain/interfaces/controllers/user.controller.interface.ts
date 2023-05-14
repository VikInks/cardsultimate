import { ServerType } from '../adapters/request.handler.interface';

export interface UserControllerInterface {
    register(
        req: ServerType['Request'],
        res: ServerType['Response'],
        next: ServerType['NextFunction']
    ): Promise<void>;
    confirmAccount(
        req: ServerType['Request'],
        res: ServerType['Response'],
        next: ServerType['NextFunction']
    ): Promise<void>;
    findByEmail(
        req: ServerType['Request'],
        res: ServerType['Response'],
        next: ServerType['NextFunction']
    ): Promise<void>;
    update(
        req: ServerType['Request'],
        res: ServerType['Response'],
        next: ServerType['NextFunction']
    ): Promise<void>;
    handleUserArchive(
        req: ServerType['Request'],
        res: ServerType['Response'],
        next: ServerType['NextFunction']
    ): Promise<void>;
    handleUserBan(
        req: ServerType['Request'],
        res: ServerType['Response'],
        next: ServerType['NextFunction']
    ): Promise<void>;
    findByUsername(
        req: ServerType['Request'],
        res: ServerType['Response'],
        next: ServerType['NextFunction']
    ): Promise<void>;
}
