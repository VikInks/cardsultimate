import {Request, Response} from "../adapters/server.interface";

export interface SwaggerAuthControllerInterface {
	showLoginForm(_: Request, res: Response): Promise<void>;
	docs(_: Request, res: Response): Promise<void>;
}