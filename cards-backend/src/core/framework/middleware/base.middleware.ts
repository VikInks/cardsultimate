import {AuthorizationServiceInterface} from "../../domain/interfaces/services/authorization.service.interface";
import {UserEntitiesInterface} from "../../domain/endpoints/user.entities.interface";
import {httpNext, httpReq, httpRes} from "../../domain/interfaces/adapters/request.handler.interface";


export abstract class BaseMiddleware {
	constructor(protected authorizationService: AuthorizationServiceInterface) {}

	protected async getUserFromToken(token: string): Promise<UserEntitiesInterface | null> {
		return await this.authorizationService.verifyToken(token);
	}

	public abstract handle(req: httpReq, res: httpRes, next: httpNext): Promise<void>;
}
