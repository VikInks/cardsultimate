
import express from 'express';
import {ServerInterface} from "../../domain/interfaces/adapters/server.interface";
import {
	IExpressApplication,
	INextFunction,
	IRequest,
	IResponse
} from "../../domain/interfaces/adapters/requestHandler.interface";

export class ExpressAdapter implements ServerInterface {
	public readonly app: express.Application;
	constructor() {
		this.app = express();
	}

	getApp(): IExpressApplication {
		return this.app as IExpressApplication;
	}

	use(path: string, ...handlers: ((req: IRequest, res: IResponse, next: INextFunction) => void)[]): void {
		this.app.use(path, ...handlers);
	}

	get(path: string, handler: (req: IRequest, res: IResponse, next: INextFunction) => void): void {
		this.app.get(path, (req: express.Request, res: express.Response, next: express.NextFunction) => {
			handler(req as IRequest, res as IResponse, next as INextFunction);
		});
	}

	delete(path: string, handler: (req: IRequest, res: IResponse, next: INextFunction) => void): void {
		this.app.delete(path, (req: express.Request, res: express.Response, next: express.NextFunction) => {
			handler(req as IRequest, res as IResponse, next as INextFunction);
		});
	}

	post(path: string, handler: (req: IRequest, res: IResponse, next: INextFunction) => void): void {
		this.app.post(path, (req: express.Request, res: express.Response, next: express.NextFunction) => {
			handler(req as IRequest, res as IResponse, next as INextFunction);
		});
	}

	put(path: string, handler: (req: IRequest, res: IResponse, next: INextFunction) => void): void {
		this.app.put(path, (req: express.Request, res: express.Response, next: express.NextFunction) => {
			handler(req as IRequest, res as IResponse, next as INextFunction);
		});
	}

	listen(port: number, callback: () => void): void {
		this.app.listen(port, callback);
	}
}

