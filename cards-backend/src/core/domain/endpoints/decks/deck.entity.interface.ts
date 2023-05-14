import {LegalityInterface} from "../cards/legality.interface";
import {CardsEntityInterface} from "../cards/cards.entity.interface";

type DeckStatus = 'public' | 'private' | 'unlisted';

export interface DeckEntityInterface {
	/**
	 * @nodisplay
	 */
	id: string
	/**
	 * @required
	 * @example
	 */
	name: string
	/**
	 * @nodisplay
	 */
	ownerId: string
	/**
	 * @nodisplay
	 */
	format: LegalityInterface[]
	/**
	 * @example
	 */
	commander?: CardsEntityInterface
	/**
	 * @required
	 * @example
	 */
	state: DeckStatus
	/**
	 * @example
	 */
	description: string
	/**
	 * @nodisplay
	 */
	created_at: string
	/**
	 * @nodisplay
	 */
	updated_at: string
	/**
	 * @example
	 */
	cards: CardsEntityInterface[]
	/**
	 * @example
	 */
	considering: CardsEntityInterface[]
	/**
	 * @example
	 */
	sideboard: CardsEntityInterface[]
	/**
	 * @example
	 */
	token?: CardsEntityInterface[]
}