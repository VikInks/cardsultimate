import {DeckServiceInterface} from "../../../../config/interfaces/services/deck.service.interface";
import {DeckRepositoryInterface} from "../../../../config/interfaces/repositories/deck.repository.interface";
import {UserServiceInterface} from "../../../../config/interfaces/services/user.service.interface";
import {DeckManagerUtilityInterface} from "../../../../config/interfaces/utils/deckManagerUtilityInterface";
import {DeckEntityInterface} from "../../../../domain/decks/deck.entity.interface";
import {CustomResponse} from "../../../../framework/error/customResponse";
import {RedisServiceInterface} from "../../../../config/interfaces/services/redis.service.interface";

export class DeckService implements DeckServiceInterface {

    constructor(
        private readonly deckRepository: DeckRepositoryInterface,
        private readonly userService: UserServiceInterface,
        private readonly deckManager: DeckManagerUtilityInterface,
        private readonly redisService: RedisServiceInterface
    ) {
    }

    async createDeck(item: DeckEntityInterface, userId: string): Promise<DeckEntityInterface> {
        try {
            const user = await this.userService.findById(userId);
            if (!user) throw new CustomResponse(404);

            item.compressedCards = await this.deckManager.compressDeck(item.cards);
            item.ownerId = user.id;

            const newDeck = await this.deckRepository.create(item, user.id);
            if (!newDeck) throw new CustomResponse(404);
            // put the new deck into redis layer
            await this.redisService.cacheData(`deck_${newDeck.id}_owner_${newDeck.ownerId}`, newDeck);
            return newDeck;
        } catch (err) {
            throw new CustomResponse(500);
        }
    }

    async deleteDeck(deckId: string, userId: string): Promise<void> {
        try {
            await this.deckRepository.findById(deckId);
        } catch (err) {
            throw new CustomResponse(404, "Deck not found");
        }

        try {
            await this.deckRepository.deleteById(deckId, userId);
            await this.redisService.deleteCachedData(`deck_${deckId}_owner_${userId}`);
            console.log(`Deck ${deckId} owned by ${userId} deleted from redis layer`)
        } catch (err) {
            throw new CustomResponse(500);
        }
    }

    async getDeck(deckId: string): Promise<DeckEntityInterface> {
        const deck = await this.deckRepository.findById(deckId);
        if (!deck) throw new CustomResponse(404);

        deck.cards = await this.deckManager.decompressDeck(deck.compressedCards || "");
        return deck;
    }

    async getDecks(user: string): Promise<DeckEntityInterface[]> {
        const decks = await this.deckRepository.findDeckByUserUsername(user);
        if (!decks || decks.length === 0) throw new Error("Decks not found");

        for (let deck of decks) {
            deck.cards = await this.deckManager.decompressDeck(deck.compressedCards || "");
        }

        return decks;
    }

    async updateDeck(item: DeckEntityInterface, userId: string): Promise<DeckEntityInterface> {
        const user = await this.userService.findById(userId);
        if (!user || item.ownerId !== user.id) throw new CustomResponse(404);
        item.compressedCards = await this.deckManager.compressDeck(item.cards);
        const updDeck = await this.deckRepository.update(item.id, item);
        if (!updDeck) throw new CustomResponse(404);
        return updDeck;
    }
}
