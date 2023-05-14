import {httpReq, httpRes, httpNext, httpApp} from './request.handler.interface';

export interface ServerInterface {
	getApp(): httpApp;
	get(path: string, handler: (req: httpReq, res: httpRes, next: httpNext) => void): void;
	post(path: string, handler: (req: httpReq, res: httpRes, next: httpNext) => void): void;
	put(path: string, handler: (req: httpReq, res: httpRes, next: httpNext) => void): void;
	delete(path: string, handler: (req: httpReq, res: httpRes, next: httpNext) => void): void;
	listen(port: number, callback: () => void): void;
	use(path: string, ...handlers: ((req: httpReq, res: httpRes, next: httpNext) => void)[]): void;
	readonly json: () => void;
	readonly urlencoded: (options?: {extended: boolean}) => void;
	[method: string]: any;
	addRoute(
		method: string,
		path: string,
		middlewares: ((req: httpReq, res: httpRes, next: httpNext) => void)[],
		action: (req: httpReq, res: httpRes, next: httpNext) => void
	): void;
}