import {BaseRepositoryInterface} from "./base.repository.interface";
import {DeckEntityInterface} from "../../endpoints/decks/deck.entity.interface";

export interface DeckRepositoryInterface extends BaseRepositoryInterface<DeckEntityInterface> {
	// inherited from BaseRepositoryInterface
	create(deck: DeckEntityInterface, id: string): Promise<DeckEntityInterface>;
	findById(id: string): Promise<DeckEntityInterface | null>;
	update(id: string, deck: DeckEntityInterface): Promise<DeckEntityInterface>;
	deleteById(id: string, otherId: string): Promise<boolean>;
	findAll(): Promise<DeckEntityInterface[]>;

	// custom methods
	findDeckByUserUsername(userId: string): Promise<DeckEntityInterface[]>;
	copyDeck(deckId: string, userId: string, reqUserId: string): Promise<DeckEntityInterface>;
	importDeck(deck: DeckEntityInterface, userId: string): Promise<DeckEntityInterface>;
}