import {INextFunction, IRequest, IResponse} from "../../requestHandler.interface";

export interface LoginControllerInterface {
	login(req: IRequest, res: IResponse, next: INextFunction): Promise<any>;
	disconnect(req: IRequest, res: IResponse, next: INextFunction): Promise<any>;
}