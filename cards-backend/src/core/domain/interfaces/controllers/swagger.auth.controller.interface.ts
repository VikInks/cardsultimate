import {httpReq, httpRes} from "../adapters/request.handler.interface";

export interface SwaggerAuthControllerInterface {
	showLoginForm(_: httpReq, res: httpRes): Promise<void>;
	docs(_: httpReq, res: httpRes): Promise<void>;
}