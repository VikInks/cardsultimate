import path from 'path';
import fs from 'fs';
import {DatabaseInterface} from "../../config/interfaces/adapters/database.interface";
import {CardsEntityInterface as Card} from "../../domain/cards/cards.entity.interface";
import {cardParameters, CardRepositoryInterface} from "../../config/interfaces/repositories/card.repository.interface";

export class CardRepository implements CardRepositoryInterface {
    constructor(readonly mongoAdapter: DatabaseInterface<Card>) {}

    async find(params: cardParameters): Promise<Card[] | null> {
        const query = Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null));

        const cards = await this.mongoAdapter.findOneOrMany(query);
        if (!cards || cards.length === 0) {
            return null;
        }
        return cards;
    }

    async initializeCards(): Promise<void> {
        const filePath = path.resolve(__dirname, '../../src/scryfall/data/all_cards.json');
        const rawData = fs.readFileSync(filePath, 'utf8');
        const cards: Card[] = JSON.parse(rawData);

        for (const card of cards) {
            await this.mongoAdapter.updateOne({ id: card.id }, card, { upsert: true });
        }
    }

}