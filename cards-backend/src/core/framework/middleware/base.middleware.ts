import {AuthorizationServiceInterface} from "../../domain/interfaces/services/authorization.service.interface";
import {UserEntitiesInterface} from "../../domain/endpoints/user.entities.interface";
import {INextFunction, IRequest, IResponse} from "../../domain/interfaces/adapters/requestHandler.interface";


export abstract class BaseMiddleware {
	constructor(protected authorizationService: AuthorizationServiceInterface) {}

	protected async getUserFromToken(token: string): Promise<UserEntitiesInterface | null> {
		return await this.authorizationService.verifyToken(token);
	}

	public abstract handle(req: IRequest, res: IResponse, next: INextFunction): Promise<void>;
}
