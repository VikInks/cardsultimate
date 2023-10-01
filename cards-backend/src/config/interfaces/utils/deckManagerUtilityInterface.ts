import {CardsEntityInterface} from "../../endpoints/cards/cards.entity.interface";

export interface DeckManagerUtilityInterface {
    compressDeck(deck: CardsEntityInterface[]): Promise<string>;
    decompressDeck(compressedDeck: string): Promise<CardsEntityInterface[]>;
}