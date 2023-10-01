import {HttpRequest, HttpResponse} from "../adapters/server.interface";


export interface SwaggerAuthControllerInterface {
	showLoginForm(_: HttpRequest, res: HttpResponse): Promise<void>;
	docs(_: HttpRequest, res: HttpResponse): Promise<void>;
}