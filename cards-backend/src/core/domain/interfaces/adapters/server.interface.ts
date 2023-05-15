export type Handler = (...args: any[]) => any;
export type NextFunction = any;
export type Request = any;
export type Response = any;

export interface ServerInterface {
	get(path: string, handler: Handler): void;
	post(path: string, handler: Handler): void;
	put(path: string, handler: Handler): void;
	delete(path: string, handler: Handler): void;
	listen(port: number, callback: () => void): void;
	use(path: string, ...handlers: Handler[]): void;
	addRoute(method: string, path: string, middlewares: Handler[], action: Handler): void;
	json(): Handler;
	urlencoded(options: { extended: boolean }): Handler;
	getApp(): any;
}
