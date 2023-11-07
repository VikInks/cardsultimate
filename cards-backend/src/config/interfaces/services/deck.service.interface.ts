import {DeckEntityInterface} from "../../../domain/decks/deck.entity.interface";


export interface DeckServiceInterface {
	createDeck: (item: DeckEntityInterface, userId: string) => Promise<DeckEntityInterface>;
	getDecks: (user: string) => Promise<DeckEntityInterface[]>;
	getDeck: (deckId: string) => Promise<DeckEntityInterface>;
	updateDeck: (item: DeckEntityInterface, userId: string) => Promise<any>;
	deleteDeck: (deckId: string, userId: string) => Promise<any>;
}