import {INextFunction, IRequest, IResponse} from "./requestHandler.interface";

export interface MiddlewareInterface {
	handle(req: IRequest, res: IResponse, next: INextFunction): Promise<void>;
}

