import { CardsEntityInterface } from "../../domain/endpoints/cards/cards.entity.interface";
import { CardRepositoryInterface } from "../../domain/interfaces/repositories/card.repository.interface";
import { DeckManagerUtilityInterface } from "../../domain/interfaces/utils/deckManagerUtilityInterface";
import { promisify } from 'util';
import * as zlib from 'zlib';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

export class DeckManagerUtility implements DeckManagerUtilityInterface {
    constructor(private readonly cardRepositoryInterface: CardRepositoryInterface) {}

    async compressDeck(deck: CardsEntityInterface[]): Promise<string> {
        const jsonString = JSON.stringify(deck);
        const compressedBuffer = await gzip(jsonString);
        return compressedBuffer.toString('base64');
    }

    async decompressDeck(compressedDeck: string): Promise<CardsEntityInterface[]> {
        const compressedBuffer = Buffer.from(compressedDeck, 'base64');
        const jsonString = await gunzip(compressedBuffer);
        const deck = JSON.parse(jsonString.toString());

        const cardDetailsPromises: Promise<CardsEntityInterface>[] = deck.map(async (cardEntry: any) => {
            const cardDetail = await this.cardRepositoryInterface.findById(cardEntry.id);
            return {
                ...cardDetail,
                count: cardEntry.count
            };
        });

        return await Promise.all(cardDetailsPromises);
    }
}
