import {UserEntitiesInterface} from "../../../domain/user.entities.interface";


export type HttpMethod = 'get' | 'post' | 'put' | 'delete';

export type Middleware = (req: HttpRequest, res: HttpResponse, next: NextFunction) => void;

export interface Connection {
	remoteAddress?: string;
}

export interface HttpServer {
	handleRequest(method: HttpMethod, path: string, middlewares: HttpHandler[], handler: HttpHandler): void;
	start(port: number, callback: () => void): void;
	getApp(): any;
	json(): any;
	urlencoded(options: { extended: boolean }): any;
}

export interface HttpRequest {
	connection: Connection;
	method: HttpMethod;
	url: string;
	headers: { [name: string]: string | string[] | undefined };
	body: any;
	params: { [name: string]: string };
	query: Record<string, any>;
	cookie: { [name: string]: string };
	user?: UserEntitiesInterface;
}

export interface HttpResponse {
	statusCode: number;
	setHeader(name: string, value: string): void;
	getHeader(name: string): string | number | string[] | undefined;
	removeHeader(name: string): void;
	write(chunk: any, encoding?: BufferEncoding, callback?: (error: Error | null | undefined) => void): boolean;
	end(callback?: () => void): void;
	status(statusCode: number): this;
	clearCookie(name: string, options?: any): this;
	cookie(name: string, value: string, options?: any): this;
	json(data: any): this;
	send(data: any): this;
}

export type HttpHandler = (req: HttpRequest, res: HttpResponse, next: NextFunction) => void;

export type NextFunction = (err?: any) => void;
