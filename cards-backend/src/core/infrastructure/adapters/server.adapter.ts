import express from 'express';
import {Handler, ServerInterface, Request, Response, NextFunction} from "../../domain/interfaces/adapters/server.interface";

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

export class ServerAdapter implements ServerInterface {
	private readonly app: express.Application;

	constructor() {
		this.app = express();
		this.app.use(this.json());
		this.app.use(this.urlencoded({extended: true}));
	}

	get(path: string, handler: Handler): void {
		this.app.get(path, (req, res, next) => handler(req as Request, res as Response, next));
	}

	post(path: string, handler: Handler): void {
		this.app.post(path, (req, res, next) => handler(req as Request, res as Response, next));
	}

	put(path: string, handler: Handler): void {
		this.app.put(path, (req, res, next) => handler(req as Request, res as Response, next));
	}

	delete(path: string, handler: Handler): void {
		this.app.delete(path, (req, res, next) => handler(req as Request, res as Response, next));
	}

	listen(port: number, callback: () => void): void {
		this.app.listen(port, callback);
	}

	use(path: string, ...handlers: Handler[]): void {
		this.app.use(path, ...(handlers.map(handler => (req: Request, res: Response, next: NextFunction) => handler(req as Request, res as Response, next))));
	}

	addRoute(method: HttpMethod, path: string, middlewares: Handler[], action: Handler): void {
		if (method in this.app) {
			(this.app[method] as any)(path, ...middlewares, action);
		} else {
			throw new Error(`Invalid HTTP method: ${method}`);
		}
	}

	json(): any {
		return express.json();
	}

	urlencoded(options: { extended: boolean }): any {
		return express.urlencoded(options);
	}

	getApp(): express.Application {
		return this.app;
	}
}