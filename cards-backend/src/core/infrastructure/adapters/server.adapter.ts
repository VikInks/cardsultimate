import express, {Application} from 'express';
import { Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction, json, urlencoded } from 'express';
import {
	HttpHandler,
	HttpRequest,
	HttpResponse,
	HttpServer
} from "../../domain/interfaces/adapters/server.interface";
import {UserEntitiesInterface} from "../../domain/endpoints/user.entities.interface";
import {Adapter} from "../../../libraries/custom/injects/frameworks/decorators/types.decorators";

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

@Adapter()
export default class ServerAdapter implements HttpServer {
	private readonly app: Application;

	constructor() {
		this.app = express();
		this.app.use(json());
		this.app.use(urlencoded({ extended: true }));
	}

	handleRequest(method: HttpMethod, path: string, middlewares: HttpHandler[], handler: HttpHandler): void {
		(this.app[method.toLowerCase() as keyof Application])(path, ...middlewares.map(middleware => (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) =>
				middleware(this.adaptRequest(req), this.adaptResponse(res), next)
			), (req: ExpressRequest, res: ExpressResponse, next: ExpressNextFunction) =>
				handler(this.adaptRequest(req), this.adaptResponse(res), next)
		);
	}

	start(port: number, callback: () => void): void {
		this.app.listen(port, callback);
	}

	getApp(): Application {
		return this.app;
	}

	json(): any {
		return json();
	}

	urlencoded(options: { extended: boolean }): any {
		return urlencoded(options);
	}

	private adaptRequest(req: ExpressRequest): HttpRequest {
		return {
			cookie: req.cookies,
			method: req.method.toLowerCase() as HttpMethod,
			url: req.url,
			headers: req.headers,
			body: req.body,
			params: req.params,
			query: req.query,
			user: req.user as UserEntitiesInterface,
			connection: req.connection,
		};
	}

	private adaptResponse(res: ExpressResponse): HttpResponse {
		return {
			statusCode: res.statusCode,
			setHeader: (name: string, value: string) => res.setHeader(name, value),
			getHeader: (name: string) => res.getHeader(name),
			removeHeader: (name: string) => res.removeHeader(name),
			write: (data: any, encoding: BufferEncoding = 'utf8', callback?: (error: Error | null | undefined) => void): boolean => res.write(data, encoding, callback),
			end: (callback?: () => void) => res.end(callback),
			status: (statusCode: number) => res.status(statusCode),
			clearCookie: (name: string, options?: any) => res.clearCookie(name, options),
			cookie: (name: string, value: string, options?: any) => res.cookie(name, value, options),
			json: (data: any) => res.json(data),
			send: (data: any) => res.send(data)
		};
	}
}
