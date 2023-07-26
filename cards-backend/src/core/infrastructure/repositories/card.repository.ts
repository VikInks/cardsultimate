import {DatabaseInterface} from "../../domain/interfaces/adapters/database.interface";
import {CardsEntityInterface as Card} from "../../domain/endpoints/cards/cards.entity.interface";
import {CardRepositoryInterface} from "../../domain/interfaces/repositories/card.repository.interface";
import {Repository} from "../../../libraries/custom/injects/frameworks/decorators/types.decorators";

@Repository()
export default class CardRepository implements CardRepositoryInterface {
	constructor(readonly mongoAdapter: DatabaseInterface<Card>) {}

	async findById(id: string): Promise<Card | null> {
		const objectId = this.mongoAdapter.stringToObjectId(id);
		const card = await this.mongoAdapter.findOne({ _id: objectId });
		if (!card) {
			throw new Error('Card not found');
		}
		return card;
	}

	async findByName(name: string): Promise<Card | null> {
		const cardName = this.mongoAdapter.findOne({ name: name });
		if (!cardName) {
			throw new Error('Card not found');
		}
		return cardName;
	}

	async findByExtension(extension: string): Promise<Card[]> {
		const cardsExt : Card[] = [];
		this.mongoAdapter.find().then((cards) => {
			cards.forEach((card) => {
				if (card.set_id === extension) {
					cardsExt.push(card);
				}
			});
		});
		if (!cardsExt) {
			throw new Error('Card not found');
		}
		return cardsExt;
	}
}