import {INextFunction, IRequest, IResponse} from "./requestHandler.interface";

export interface LoginInterface {
	login(req: IRequest, res: IResponse, next: INextFunction): Promise<any>;
	disconnect(req: IRequest, res: IResponse): Promise<any>;
}
