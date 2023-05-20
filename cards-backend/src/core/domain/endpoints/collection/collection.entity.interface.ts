import {CardsEntityInterface} from "../cards/cards.entity.interface";

export interface CollectionEntityInterface {
	/**
	 * @example
	 */
	id: string;
	/**
	 * @example
	 */
	idOwner: string;
	/**
	 * @example
	 */
	cards: CardsEntityInterface[];
	/**
	 * @nodisplay
	 */
	updateDate: Date;
}