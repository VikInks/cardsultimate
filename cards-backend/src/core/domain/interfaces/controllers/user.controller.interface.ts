import {ExpressTypes} from "../../requestHandler.interface";

export interface UserControllerInterface {
	register(req: ExpressTypes['Request'], res: ExpressTypes['Response'], next: ExpressTypes['NextFunction']): Promise<void>;
	confirmAccount(req: ExpressTypes['Request'], res: ExpressTypes['Response'], next: ExpressTypes['NextFunction']): Promise<void>;
	findByEmail(req: ExpressTypes['Request'], res: ExpressTypes['Response'], next: ExpressTypes['NextFunction']): Promise<void>;
	verifyPassword(req: ExpressTypes['Request'], res: ExpressTypes['Response'], next: ExpressTypes['NextFunction']): Promise<void>;
	update(req: ExpressTypes['Request'], res: ExpressTypes['Response'], next: ExpressTypes['NextFunction']): Promise<void>;
	archive(req: ExpressTypes['Request'], res: ExpressTypes['Response'], next: ExpressTypes['NextFunction']): Promise<void>;
	unarchive(req: ExpressTypes['Request'], res: ExpressTypes['Response'], next: ExpressTypes['NextFunction']): Promise<void>;
	ban(req: ExpressTypes['Request'], res: ExpressTypes['Response'], next: ExpressTypes['NextFunction']): Promise<void>;
	unban(req: ExpressTypes['Request'], res: ExpressTypes['Response'], next: ExpressTypes['NextFunction']): Promise<void>;
}
