import {CardsEntityInterface} from "../../../domain/cards/cards.entity.interface";

/**
 * @interface CardServiceInterface
 * @memberOf CardServiceInterface
 * @function getCards - This function is used to get cards from the database.
 */
export interface CardServiceInterface {
	getCards(params: any): Promise<CardsEntityInterface | CardsEntityInterface[] | null>;
	refreshCardDatabase(): Promise<void>;
}