import {CardsEntityInterface} from "../cards/cards.entity.interface";

export interface CollectionEntityInterface {
	/**
	 * @nodisplay
	 */
	id: string;
	/**
	 * @nodisplay
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