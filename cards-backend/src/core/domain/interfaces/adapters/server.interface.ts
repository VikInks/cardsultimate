import {IRequest, IResponse, INextFunction, IExpressApplication} from './requestHandler.interface';

export interface ServerInterface {
	getApp(): IExpressApplication;
	get(path: string, handler: (req: IRequest, res: IResponse, next: INextFunction) => void): void;
	post(path: string, handler: (req: IRequest, res: IResponse, next: INextFunction) => void): void;
	put(path: string, handler: (req: IRequest, res: IResponse, next: INextFunction) => void): void;
	delete(path: string, handler: (req: IRequest, res: IResponse, next: INextFunction) => void): void;
	listen(port: number, callback: () => void): void;
	use(path: string, ...handlers: ((req: IRequest, res: IResponse, next: INextFunction) => void)[]): void;
	readonly json: () => void;
	readonly urlencoded: (options?: {extended: boolean}) => void;
	[method: string]: any;
	addRoute(
		method: string,
		path: string,
		middlewares: ((req: IRequest, res: IResponse, next: INextFunction) => void)[],
		action: (req: IRequest, res: IResponse, next: INextFunction) => void
	): void;
}