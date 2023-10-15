import {UserEntitiesInterface} from "../../../domain/user.entities.interface";

/**
 * HttpMethod
 * @description This type is used to define the http methods that will be used in the application.
 * @property {string} get - This property is used to define the http method get.
 * @property {string} post - This property is used to define the http method post.
 * @property {string} put - This property is used to define the http method put.
 * @property {string} delete - This property is used to define the http method delete.
 */
export type HttpMethod = 'get' | 'post' | 'put' | 'delete';


/**
 * Connection
 * @description This type is used to define the connection object.
 * @property {string} remoteAddress - This property is used to define the remote address of the connection.
 */
export interface Connection {
	remoteAddress?: string;
}

/**
 * HttpServer
 * @description This type is used to define the http server object.
 * @property {Function} handleRequest - This property is used to define the handle request function.
 * @property {Function} start - This property is used to define the start function.
 * @property {Function} getApp - This property is used to define the get app function.
 * @property {Function} json - This property is used to define the json function.
 * @property {Function} urlencoded - This property is used to define the urlencoded function.
 */
export interface HttpServer {
	handleRequest(method: HttpMethod, path: string, middlewares: HttpHandler[], handler: HttpHandler): void;
	start(port: number, callback: () => void): void;
	getApp(): any;
	json(): any;
	urlencoded(options: { extended: boolean }): any;
}

/**
 * HttpRequest
 * @description This type is used to define the http request object.
 * @property {Connection} connection - This property is used to define the connection object.
 * @property {HttpMethod} method - This property is used to define the http method.
 * @property {string} url - This property is used to define the url.
 * @property {Object} headers - This property is used to define the headers.
 * @property {Object} body - This property is used to define the body.
 * @property {Object} params - This property is used to define the params.
 * @property {Object} query - This property is used to define the query.
 * @property {Object} cookie - This property is used to define the cookie.
 * @property {UserEntitiesInterface} user - This property is used to define the user.
 */
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

/**
 * HttpResponse
 * @description This type is used to define the http response object.
 * @property {number} statusCode - This property is used to define the status code.
 * @property {Function} setHeader - This property is used to define the set header function.
 * @property {Function} getHeader - This property is used to define the get header function.
 * @property {Function} removeHeader - This property is used to define the remove header function.
 * @property {Function} write - This property is used to define the write function.
 * @property {Function} end - This property is used to define the end function.
 * @property {Function} status - This property is used to define the status function.
 * @property {Function} clearCookie - This property is used to define the clear cookie function.
 * @property {Function} cookie - This property is used to define the cookie function.
 * @property {Function} json - This property is used to define the json function.
 * @property {Function} send - This property is used to define the send function.
 * @property {Function} on - This property is used to define the on function.
 */
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
	on(event: string, listener: (...args: any[]) => void): this;
}

/**
 * HttpHandler
 * @description This type is used to define the http handler object.
 * @property {HttpRequest} req - This property is used to define the http request.
 * @property {HttpResponse} res - This property is used to define the http response.
 * @property {NextFunction} next - This property is used to define the next function.
 */
export type HttpHandler = (req: HttpRequest, res: HttpResponse, next: NextFunction) => void;

/**
 * NextFunction
 * @description This type is used to define the next function.
 * @property {any} err - This property is used to define the error.
 */
export type NextFunction = (err?: any) => void;
