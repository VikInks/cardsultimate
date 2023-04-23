import {INextFunction, IRequest, IResponse} from "../adapters/requestHandler.interface";

export interface LoginControllerInterface {
	login(req: IRequest, res: IResponse, next: INextFunction): Promise<any>;
	disconnect(req: IRequest, res: IResponse, next: INextFunction): Promise<any>;
}