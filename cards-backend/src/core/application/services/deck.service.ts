import {DeckServiceInterface} from "../../domain/interfaces/services/deck.service.interface";
import {DeckEntityInterface} from "../../domain/endpoints/decks/deck.entity.interface";
import {DeckRepositoryInterface} from "../../domain/interfaces/repositories/deck.repository.interface";
import {UserServiceInterface} from "../../domain/interfaces/services/user.service.interface";

export default class DeckService implements DeckServiceInterface {
	constructor(private readonly deckRepository: DeckRepositoryInterface, private readonly userService: UserServiceInterface) {
	}

	async createDeck(item: DeckEntityInterface, userId: string): Promise<DeckEntityInterface | { message: string }> {
		return this.deckRepository.create(item, userId).then((deck) => {
			return deck;
		}).catch(err => {
			return {message: `Error creating deck ${err}`};
		});
	}

	async deleteDeck(deckId: string, userId: string): Promise<{ message: string }> {
		return this.deckRepository.deleteById(deckId, userId).then(() => {
			return {message: "Deck deleted successfully"};
		}).catch(err => {
			return {message: `Error deleting deck ${err}`};
		});
	}

	async getDeck(deckId: string): Promise<DeckEntityInterface> {
		return this.deckRepository.findById(deckId).then(deck => {
			if (deck) {
				return deck;
			} else {
				return Promise.reject("Deck not found");
			}
		}).catch(err => {
			return Promise.reject(err);
		});
	}

	async getDecks(user: string): Promise<DeckEntityInterface[]> {
		return this.deckRepository.findDeckByUserUsername(user).then(decks => {
			if (decks) {
				return decks;
			} else {
				return Promise.reject("Decks not found");
			}
		}).catch(err => {
			return Promise.reject(err);
		});
	}

	async updateDeck(item: DeckEntityInterface, userId: string): Promise<DeckEntityInterface | { message: string }> {
		return this.userService.findById(userId).then((user) => {
			if (item.ownerId === user?.id) {
				this.deckRepository.update(item.id, item).then((deck) => {
					return deck;
				}).catch(err => {
					return {message: `Error updating deck ${err}`};
				});
			}
			return Promise.reject("You are not the owner of this deck");
		}).catch(err => {
			return {message: `Error updating deck ${err}`};
		});
	}

}
