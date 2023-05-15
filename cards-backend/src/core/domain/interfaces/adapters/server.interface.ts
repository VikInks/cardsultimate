export interface Handler {
	(req: Request, res: Response, next: NextFunction): void;
}

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

export type Request = {
	headers?: any;
	body: any;
	params: any;
	query: any;
	cookies: any;
	path: string;
	user?: any;
};

export type Response = {
	status(code: number): Response;
	send(body: any): void;
	json(param: any): void;
	redirect(path: string): void;
	header(location: string, s: string): any;
	cookie(name: string, value: string, options: any): any;
	clearCookie(name: string, options?: any): any;
	end(): void;
};

export type NextFunction = (err?: any) => void;
