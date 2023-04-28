import express from 'express';
import {ServerInterface} from "../../domain/interfaces/adapters/server.interface";
import {httpApp, httpNext, httpReq, httpRes} from "../../domain/interfaces/adapters/request.handler.interface";

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

function isHttpMethod(method: string): method is HttpMethod {
	return ['get', 'post', 'put', 'delete'].includes(method);
}

export class ServerAdapter implements ServerInterface {
	public readonly app: express.Application;

	constructor() {
		this.app = express();
	}

	addRoute(method: string, path: string, middlewares: ((req: httpReq, res: httpRes, next: httpNext) => void)[], action: (req: httpReq, res: httpRes, next: httpNext) => void): void {
		if (isHttpMethod(method)) {
			this.app[method](path, ...middlewares, action);
		} else {
			throw new Error(`Invalid HTTP method: ${method}`);
		}
	}

	json() {
		return express.json();
	}

	urlencoded(options?: { extended: boolean }) {
		return express.urlencoded(options);
	}

	getApp(): httpApp {
		return this.app as httpApp;
	}

	use(path: string, ...handlers: ((req: httpReq, res: httpRes, next: httpNext) => void)[]): void {
		this.app.use(path, ...handlers);
	}

	get(path: string, handler: (req: httpReq, res: httpRes, next: httpNext) => void): void {
		this.app.get(path, (req: express.Request, res: express.Response, next: express.NextFunction) => {
			(res as httpRes).clearCookie = res.clearCookie.bind(res);
			(res as httpRes).end = res.end.bind(res);
			handler(req as httpReq, res as httpRes, next as httpNext);
		});
	}

	delete(path: string, handler: (req: httpReq, res: httpRes, next: httpNext) => void): void {
		this.app.delete(path, (req: express.Request, res: express.Response, next: express.NextFunction) => {
			(res as httpRes).clearCookie = res.clearCookie.bind(res);
			(res as httpRes).end = res.end.bind(res);
			handler(req as httpReq, res as httpRes, next as httpNext);
		});
	}

	post(path: string, handler: (req: httpReq, res: httpRes, next: httpNext) => void): void {
		this.app.post(path, (req: express.Request, res: express.Response, next: express.NextFunction) => {
			(res as httpRes).clearCookie = res.clearCookie.bind(res);
			(res as httpRes).end = res.end.bind(res);
			handler(req as httpReq, res as httpRes, next as httpNext);
		});
	}

	put(path: string, handler: (req: httpReq, res: httpRes, next: httpNext) => void): void {
		this.app.put(path, (req: express.Request, res: express.Response, next: express.NextFunction) => {
			(res as httpRes).clearCookie = res.clearCookie.bind(res);
			(res as httpRes).end = res.end.bind(res);
			handler(req as httpReq, res as httpRes, next as httpNext);
		});
	}

	listen(port: number, callback: () => void): void {
		this.app.listen(port, callback);
	}
}