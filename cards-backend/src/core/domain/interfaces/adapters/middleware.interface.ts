import {INextFunction, IRequest, IResponse} from "./requestHandler.interface";

// MiddlewareInterface.ts
export interface MiddlewareInterface {
	handle(req: IRequest, res: IResponse, next: INextFunction): void;
}


