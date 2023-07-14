import { CardsEntityInterface as Card } from "../../endpoints/cards/cards.entity.interface";

export interface CardServiceInterface {
	getCardById(id: string): Promise<Card | null>;
	getCardByName(name: string): Promise<Card | Card[] | null>;
	getCardByExtension(extension: string): Promise<Card[]>;
}