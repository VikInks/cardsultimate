import {CardsEntityInterface} from "../../endpoints/cards/cards.entity.interface";

export interface CardRepositoryInterface {
	findById(id: string): Promise<CardsEntityInterface | null>;
	findByName(name: string): Promise<CardsEntityInterface | CardsEntityInterface[] | null>;
	findByExtension(extension: string): Promise<CardsEntityInterface[]>;
}