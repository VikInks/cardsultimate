import {CardServiceInterface} from "../../../config/interfaces/services/card.service.interface";
import { CardsEntityInterface} from "../../../domain/cards/cards.entity.interface";
import {
	cardParameters,
	CardRepositoryInterface
} from "../../../config/interfaces/repositories/card.repository.interface";

export class CardService implements CardServiceInterface {
	constructor(private readonly cardRepository: CardRepositoryInterface) {
	}

	async getCards(params: cardParameters): Promise<CardsEntityInterface | CardsEntityInterface[] | null> {
		const card = this.cardRepository.find(params);
		if (!card) {
			return null;
		}
		return card;
	}
}