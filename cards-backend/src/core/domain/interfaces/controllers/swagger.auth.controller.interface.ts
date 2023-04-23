import {IRequest, IResponse} from "../../requestHandler.interface";

export interface SwaggerAuthControllerInterface {
	showLoginForm(_: IRequest, res: IResponse): Promise<void>;
	docs(_: IRequest, res: IResponse): Promise<void>;
}