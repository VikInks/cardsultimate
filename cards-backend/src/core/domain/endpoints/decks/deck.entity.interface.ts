import {LegalityInterface} from "../cards/legality.interface";

export interface DeckEntityInterface {
	id: string
	name: string
	owner: string
	format: LegalityInterface
	created_at: string
	updated_at: string
}