import {httpNext, httpReq, httpRes} from "../adapters/request.handler.interface";

export interface LoginControllerInterface {
	login(req: httpReq, res: httpRes, next: httpNext): Promise<any>;
	disconnect(req: httpReq, res: httpRes, next: httpNext): Promise<any>;
}