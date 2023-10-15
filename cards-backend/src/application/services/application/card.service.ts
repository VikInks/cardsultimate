import * as fs from 'fs';
import * as path from 'path';
import {CardServiceInterface} from "../../../config/interfaces/services/card.service.interface";
import {CardsEntityInterface} from "../../../domain/cards/cards.entity.interface";
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
    private readonly MAX_RETRIES = 3;
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

    /**
     * Initialize the cards in the database
     * @public
     * @method initializeCards
     * @memberOf CardService
     * @returns {Promise<void>}
     * @author VikInks
     */
    async initializeCards(): Promise<void> {
        const filePath = path.resolve(__dirname, '../../src/scryfall/data/all_cards.json');

        for (let retries = 0; retries < this.MAX_RETRIES; retries++) {
            try {
                console.log(`Attempt ${retries + 1}: Initializing cards...`);

                if (!fs.existsSync(filePath)) {
                    console.log("File not found. Fetching data...");
                    await this.bulkService.getBulkData();
                }

                const rawData = fs.readFileSync(filePath, 'utf8');
                await this.cardRepository.update(JSON.parse(rawData));
                return;
            } catch (error) {
                console.error("Error in initializeCards:", error);
                console.log(`Attempt ${retries + 1} failed. Retrying...`);
            }
        }

        console.error(`Failed to initialize cards after ${this.MAX_RETRIES} attempts.`);
    }

    /**
     * Refresh the card database
     * @public
     * @method refreshCardDatabase
     * @memberOf CardService
     * @returns {Promise<void>}
     * @description
     * This method is used to refresh the card database.
     * It first gets the bulk data from scryfall.
     * Then it checks if the data is different from the data in the database.
     * If it is different, it updates the database.
     * If it is not different, it does nothing.
     * @author VikInks
     */
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