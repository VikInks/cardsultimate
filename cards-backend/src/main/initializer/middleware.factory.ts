import { IRequest, IResponse, INextFunction } from "../../domain/interfaces/requestHandler.interface";
import { AdminMiddleware } from "../middleware/admin.middleware";
import { SuperuserMiddleware } from "../middleware/superuser.middleware";
import {AuthorizationServiceInterface} from "../../domain/interfaces/services/authorization.service.interface";

function createAdminMiddleware(authorizationService: AuthorizationServiceInterface) {
	return new AdminMiddleware(authorizationService);
}

function createSuperuserMiddleware(authorizationService: AuthorizationServiceInterface) {
	return new SuperuserMiddleware(authorizationService);
}

export const middlewareFactory = {
	isAdmin: (authorizationService: AuthorizationServiceInterface) => (
		req: IRequest,
		res: IResponse,
		next: INextFunction
	) => createAdminMiddleware(authorizationService).handle(req, res, next),
	isSuperUser: (authorizationService: AuthorizationServiceInterface) => (
		req: IRequest,
		res: IResponse,
		next: INextFunction
	) => createSuperuserMiddleware(authorizationService).handle(req, res, next),
};
