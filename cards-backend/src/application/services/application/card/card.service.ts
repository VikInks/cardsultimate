import { CardServiceInterface } from "../../../../config/interfaces/services/card.service.interface";
import { CardsEntityInterface } from "../../../../domain/cards/cards.entity.interface";
import { cardParameters, CardRepositoryInterface } from "../../../../config/interfaces/repositories/card.repository.interface";
import { RedisServiceInterface } from "../../../../config/interfaces/services/redis.service.interface";
import { REDIS_TIMER } from "../../../../config/redis.config";
import {WebSocketServerInterface} from "../../../../config/interfaces/services/websocket.interface";

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
        private readonly redisService: RedisServiceInterface,
        private readonly websocket: WebSocketServerInterface
    ) {}

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