import path from 'path';
import fs from 'fs';
import {DatabaseInterface} from "../../config/interfaces/adapters/database.interface";
import {CardsEntityInterface, CardsEntityInterface as Card} from "../../domain/cards/cards.entity.interface";
import {cardParameters, CardRepositoryInterface} from "../../config/interfaces/repositories/card.repository.interface";

export class CardRepository implements CardRepositoryInterface {
    constructor(readonly mongoAdapter: DatabaseInterface<Card>) {
    }

    async find(params: cardParameters): Promise<CardsEntityInterface | CardsEntityInterface[] | null> {
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
        try {
            await this.update(cards);
        } catch (error) {
            console.error("Error in initializeCards:", error);
        }
    }

    async update(cards: Card[]): Promise<void> {
        cards.map(async card => {
            const cardInDb = await this.mongoAdapter.findOne({id: card.id});
            if (!cardInDb) {
                await this.mongoAdapter.insertOne(card);
                console.log(`Card ${card.name} inserted`);
            }
            if (cardInDb !== card) {
                await this.mongoAdapter.updateOne({id: cardInDb?.id}, card);
                console.log(`Card ${card.name} updated`);
            }
        });
    }
}