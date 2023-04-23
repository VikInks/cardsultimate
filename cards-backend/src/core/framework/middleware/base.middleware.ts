import { IRequest, IResponse, INextFunction } from "../../core/domain/interfaces/adapters/requestHandler.interface";
import { UserEntitiesInterface } from "../../core/domain/entities/user.entities.interface";
import {AuthorizationServiceInterface} from "../../core/domain/interfaces/services/authorization.service.interface";

export abstract class BaseMiddleware {
	constructor(protected authorizationService: AuthorizationServiceInterface) {}

	protected async getUserFromToken(token: string): Promise<UserEntitiesInterface | null> {
		return await this.authorizationService.verifyToken(token);
	}

	public abstract handle(req: IRequest, res: IResponse, next: INextFunction): Promise<void>;
}
