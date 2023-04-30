import {httpNext, httpReq, httpRes} from "./request.handler.interface";

// MiddlewareInterface.ts
export interface MiddlewareInterface {
	handle(req: httpReq, res: httpRes, next: httpNext): void;
}


