import {HttpRequest, HttpResponse, NextFunction} from "../adapters/server.interface";

export interface DeckControllerInterface {
	createDeck(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<any>;
	deleteDeck(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<any>;
	getDeck(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<any>;
	getDecks(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<any>;
	updateDeck(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<any>;
}