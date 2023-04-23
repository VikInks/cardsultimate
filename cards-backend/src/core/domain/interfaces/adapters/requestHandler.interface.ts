export interface IRequest {
	// Définissez les propriétés et méthodes nécessaires pour votre application
	headers?: any;
	user?: any;
	body: any;
	params: any;
	query: any;
	cookies: any;
	path: string;
}

export interface IResponse {
	status(code: number): IResponse;
	send(body: any): void;
	json(param: any): void;
	redirect(path: string): void;
	header(location: string, s: string): any;
}

export interface INextFunction {
	// Définissez la signature de la fonction
	(err?: any): void;
}

export interface ExpressTypes {
	Request: IRequest;
	Response: IResponse;
	NextFunction: INextFunction;
}

export type IExpressApplication = {
	[method: string]: any | undefined;
}