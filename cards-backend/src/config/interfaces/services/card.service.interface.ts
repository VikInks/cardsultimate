import {CardsEntityInterface} from "../../../domain/cards/cards.entity.interface";


export interface CardServiceInterface {
	getCards(params: any): Promise<CardsEntityInterface | CardsEntityInterface[] | null>;
}