import {AuthorizationServiceInterface} from "../../domain/interfaces/services/authorization.service.interface";
import {UserEntitiesInterface} from "../../domain/endpoints/user.entities.interface";
import {NextFunction, Request, Response} from "../../domain/interfaces/adapters/server.interface";



export abstract class BaseMiddleware {
	constructor(protected authorizationService: AuthorizationServiceInterface) {}

	protected async getUserFromToken(token: string): Promise<UserEntitiesInterface | null> {
		return await this.authorizationService.verifyToken(token);
	}

	public abstract handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}
