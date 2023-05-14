export interface httpReq {
	headers?: any;
	user?: any;
	body: any;
	params: any;
	query: any;
	cookies: any;
	path: string;
}

export interface httpRes {
	status(code: number): httpRes;
	send(body: any): void;
	json(param: any): void;
	redirect(path: string): void;
	header(location: string, s: string): any;
	cookie(name: string, value: string, options: any): any;
	clearCookie(name: string, options?: any): any;
	end(): void;
}

export interface httpNext {
	(err?: any): void;
}

export interface ServerType {
	Request: httpReq;
	Response: httpRes;
	NextFunction: httpNext;
}

export type httpApp = {
	[method: string]: any | undefined;
}
