import { LegalityInterface } from "../cards/legality.interface";
import { CardsEntityInterface } from "../cards/cards.entity.interface";

type DeckStatus = 'public' | 'private' | 'unlisted';

export interface DeckEntityInterface {
	id: string;
	name: string;
	ownerId: string;
	format: LegalityInterface[];
	commander?: CardsEntityInterface;
	state: DeckStatus;
	description: string;
	created_at: string;
	updated_at: string;

	// Original card lists
	cards: CardsEntityInterface[];
	considering: CardsEntityInterface[];
	sideboard: CardsEntityInterface[];
	token?: CardsEntityInterface[];

	// Compressed card lists
	compressedCards?: string;
	compressedConsidering?: string;
	compressedSideboard?: string;
	compressedToken?: string;
}
