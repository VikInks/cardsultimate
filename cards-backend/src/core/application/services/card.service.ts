import {CardServiceInterface} from "../../domain/interfaces/services/card.service.interface";
import { CardsEntityInterface as Card} from "../../domain/endpoints/cards/cards.entity.interface";
import {CardRepositoryInterface} from "../../domain/interfaces/repositories/card.repository.interface";
import {Service} from "../../../libraries/custom/injects/frameworks/decorators/types.decorators";

@Service(7)
export default class CardService implements CardServiceInterface {
	constructor(private readonly cardRepository: CardRepositoryInterface) {
	}

	async getCardById(id: string): Promise<Card | null> {
		const card = this.cardRepository.findById(id);
		if (!card) {
			throw new Error('Card not found');
		}
		return card;
	}

	async getCardByName(name: string): Promise<Card | Card[] | null> {
		const card = this.cardRepository.findByName(name);
		if (!card) {
			throw new Error('Card not found');
		}
		return card;
	}

	async getCardByExtension(extension: string): Promise<Card[]> {
		const card = this.cardRepository.findByExtension(extension);
		if (!card) {
			throw new Error('Card not found');
		}
		return card;
	}
}