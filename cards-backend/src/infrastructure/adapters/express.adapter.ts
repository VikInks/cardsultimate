import { ServerInterface } from "../../domain/interfaces/server.interface";
import { IRequest, IResponse, INextFunction, IExpressApplication } from "../../domain/interfaces/requestHandler.interface";
import express from 'express';

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

