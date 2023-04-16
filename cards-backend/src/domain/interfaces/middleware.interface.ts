import {INextFunction, IRequest, IResponse} from "./requestHandler.interface";

interface Middleware {
	(req: IRequest, res: IResponse, next: INextFunction): Promise<void>;
}
export interface MiddlewareCollection {
	[key: string]: Middleware;
}