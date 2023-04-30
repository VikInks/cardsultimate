import {httpNext, httpReq, httpRes} from "../adapters/request.handler.interface";

export interface DeckControllerInterface {
	createDeck(req: httpReq, res: httpRes, next: httpNext): Promise<any>;
	deleteDeck(req: httpReq, res: httpRes, next: httpNext): Promise<any>;
	getDeck(req: httpReq, res: httpRes, next: httpNext): Promise<any>;
	getDecks(req: httpReq, res: httpRes, next: httpNext): Promise<any>;
	updateDeck(req: httpReq, res: httpRes, next: httpNext): Promise<any>;
}