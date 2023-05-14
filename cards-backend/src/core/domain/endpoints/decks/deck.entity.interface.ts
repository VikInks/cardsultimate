import {LegalityInterface} from "../cards/legality.interface";
import {CardsEntityInterface} from "../cards/cards.entity.interface";

type DeckStatus = 'public' | 'private' | 'unlisted';

export interface DeckEntityInterface {
	id: string
	name: string
	ownerId: string
	format: LegalityInterface
	state: DeckStatus
	description: string
	created_at: string
	updated_at: string
	cards: CardsEntityInterface[]
}