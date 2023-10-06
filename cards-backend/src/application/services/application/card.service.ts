import path from 'path';
import fs from 'fs';
import {CardServiceInterface} from "../../../config/interfaces/services/card.service.interface";
import {CardsEntityInterface as Card, CardsEntityInterface} from "../../../domain/cards/cards.entity.interface";
import {
    cardParameters,
    CardRepositoryInterface
} from "../../../config/interfaces/repositories/card.repository.interface";
import {RedisServiceInterface} from "../../../config/interfaces/services/redis.service.interface";
import {REDIS_TIMER} from "../../../config/redis.config";
import {BulkDataServiceInterface} from "../../../config/interfaces/services/bulk.data.service.interface";

/**
 * Card service
 * @class CardService
 * @extends {CardServiceInterface}
 * @description
 * This service is responsible for implementing the logic for the card endpoints in the application layer
 * @author VikInks
 */
export class CardService implements CardServiceInterface {
    constructor(
        private readonly cardRepository: CardRepositoryInterface,
        private readonly bulkService: BulkDataServiceInterface,
        private readonly redisService: RedisServiceInterface
    ) {
    }

    /**
     * Get cards from the database
     * Cache the cards in redis
     * Return the cards
     *
     * @returns {Promise<CardsEntityInterface | CardsEntityInterface[] | null>}
     * @memberOf CardService
     * @param {cardParameters} params
     * @author VikInks
     */
    async getCards(params: cardParameters): Promise<CardsEntityInterface | CardsEntityInterface[] | null> {
        try {
            const cards = await this.cardRepository.find(params);
            if (!cards) return null;
            if (Array.isArray(cards)) {
                await this.cacheMultipleCards(cards);
            } else {
                await this.cacheSingleCard(cards);
            }

            return cards;
        } catch (error) {
            console.error("Error in getCards:", error);
            return null;
        }
    }

    async initializeCards(): Promise<void> {
        const filePath = path.resolve(__dirname, '../../src/scryfall/data/all_cards.json');
        if (!filePath) {
            await this.bulkService.getBulkData();
            return this.initializeCards();
        }
        const rawData = fs.readFileSync(filePath, 'utf8');
        const cards: Card[] = JSON.parse(rawData);
        try {
            await this.cardRepository.update(cards);
        } catch (error) {
            console.error("Error in initializeCards:", error);
        }
    }

    async refreshCardDatabase(): Promise<void> {
        try {
            await this.initializeCards();
        } catch (error) {
            console.error("Error in refreshCardDatabase:", error);
        }
    }

    /**
     * Cache multiple cards in redis
     * @private
     * @memberOf CardService
     * @returns {Promise<void>}
     * @param {CardsEntityInterface[]} cards
     * @author VikInks
     */
    private async cacheMultipleCards(cards: CardsEntityInterface[]): Promise<void> {
        const cachePromises = cards.map(card => this.cacheCard(`card_${card.lang}_id:${card.id}`, card));
        await Promise.all(cachePromises);
    }

    /**
     * Cache a single card in redis
     * @private
     * @memberOf CardService
     * @returns {Promise<void>}
     * @param {CardsEntityInterface} card
     * @author VikInks
     */
    private async cacheSingleCard(card: CardsEntityInterface): Promise<void> {
        await this.cacheCard(`card_${card.lang}_id:${card.id}`, card);
    }

    /**
     * Cache a card in redis
     * @private
     * @memberOf CardService
     * @returns {Promise<void>}
     * @param {string} key
     * @param {CardsEntityInterface} card
     * @description
     * The key is the language and id of the card
     * The value is the card object
     * The timer is one day
     * @example
     * await this.cacheCard("card_en_id:1234", card);
     * @author VikInks
     */
    private async cacheCard(key: string, card: CardsEntityInterface): Promise<void> {
        try {
            await this.redisService.cacheData(key, card, REDIS_TIMER.ONE_DAY);
        } catch (error) {
            console.error(`Failed to cache card with key ${key}:`, error);
        }
    }
}