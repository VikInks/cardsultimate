import {INextFunction, IRequest, IResponse} from "./requestHandler.interface";

export interface LoginInterface {
	login(email: string, password: string, next: INextFunction): Promise<any>;
	disconnect(): Promise<any>;
}

export interface LoginControllerInterface {
	login(req: IRequest, res: IResponse, next: INextFunction): Promise<any>;
	disconnect(req: IRequest, res: IResponse, next: INextFunction): Promise<any>;
}
