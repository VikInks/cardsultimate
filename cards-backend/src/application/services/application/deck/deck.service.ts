import {DeckServiceInterface} from "../../../../config/interfaces/services/deck.service.interface";
import {DeckRepositoryInterface} from "../../../../config/interfaces/repositories/deck.repository.interface";
import {UserServiceInterface} from "../../../../config/interfaces/services/user.service.interface";
import {DeckManagerUtilityInterface} from "../../../../config/interfaces/utils/deckManagerUtilityInterface";
import {DeckEntityInterface} from "../../../../domain/decks/deck.entity.interface";
import {CustomResponse} from "../../../../framework/error/customResponse";

export class DeckService implements DeckServiceInterface {

    constructor(
        private readonly deckRepository: DeckRepositoryInterface,
        private readonly userService: UserServiceInterface,
        private readonly deckManager: DeckManagerUtilityInterface,
    ) {}

    async createDeck(item: DeckEntityInterface, userId: string): Promise<DeckEntityInterface | { message: string }> {
        try {
            const user = await this.userService.findById(userId);
            if (!user) throw new CustomResponse(404);

            item.compressedCards = await this.deckManager.compressDeck(item.cards);
            item.ownerId = user.id;

            return await this.deckRepository.create(item, user.id);
        } catch (err) {
            return {message: `Error creating deck ${err}`};
        }
    }

    async deleteDeck(deckId: string, userId: string): Promise<void> {
        const delDeck = this.deckRepository.deleteById(deckId, userId);
        if (!delDeck) throw new CustomResponse(404);
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
