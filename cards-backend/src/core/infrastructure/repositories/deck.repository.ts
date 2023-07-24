import {DeckRepositoryInterface} from "../../domain/interfaces/repositories/deck.repository.interface";
import {DeckEntityInterface} from "../../domain/endpoints/decks/deck.entity.interface";
import {DatabaseInterface} from "../../domain/interfaces/adapters/database.interface";
import {OptionalId} from "mongodb";

export default class DeckRepository implements DeckRepositoryInterface {
	constructor(private readonly mongoAdapter: DatabaseInterface<DeckEntityInterface>) {
	}
	async copyDeck(deckId: string, userId: string, reqUserId: string): Promise<DeckEntityInterface> {
		const idDeck = await this.mongoAdapter.stringToObjectId(deckId);
		const idUser = await this.mongoAdapter.stringToObjectId(userId);
		const idReqUser = await this.mongoAdapter.stringToObjectId(reqUserId);

		const deck = await this.mongoAdapter.findOne({ _id: idDeck });
		const user = await this.mongoAdapter.findOne({ _id: idUser });
		const reqUser = await this.mongoAdapter.findOne({ _id: idReqUser });

		if (!deck || !user || !reqUser) {
			throw new Error('Deck not found');
		}

		return await this.create(deck, userId);
	}

	async create(deck: DeckEntityInterface, id: string): Promise<DeckEntityInterface> {
		const objectId = await this.mongoAdapter.stringToObjectId(id);
		const user = await this.mongoAdapter.findOne({ _id: objectId });
		if (!user) {
			throw new Error('User not found');
		}
		const result = await this.mongoAdapter.insertOne(deck);
		if (!result.insertedId) {
			throw new Error('Failed to insert deck.');
		}
		return { ...deck, id: result.insertedId.toHexString() };
	}

	async deleteById(id: string, otherId: string): Promise<boolean> {
		const objectId = await this.mongoAdapter.stringToObjectId(id);
		const otherObjectId = await this.mongoAdapter.stringToObjectId(otherId);
		const deck = await this.mongoAdapter.findOne({ _id: objectId });
		const user = await this.mongoAdapter.findOne({ _id: otherObjectId });
		if (!deck || !user) {
			throw new Error('Deck not found');
		}
		return await this.mongoAdapter.deleteOne({ id: objectId });
	}

	async findAll(): Promise<DeckEntityInterface[]> {
		const decks = await this.mongoAdapter.find();
		return decks.map((deck: OptionalId<DeckEntityInterface>) => {
			const id = deck._id?.toHexString() || deck.id;
			if (!id) throw new Error('Deck id is missing.');
			return { ...deck, id, _id: undefined };
		});
	}

	async findById(id: string): Promise<DeckEntityInterface | null> {
		const objectId = await this.mongoAdapter.stringToObjectId(id);
		const deck = await this.mongoAdapter.findOne({ _id: objectId });
		if (!deck) {
			throw new Error('Deck not found');
		}
		return deck;
	}

	async findDeckByUserUsername(userId: string): Promise<DeckEntityInterface[]> {
		const objectId = await this.mongoAdapter.stringToObjectId(userId);
		const user = await this.mongoAdapter.findOne({ _id: objectId });
		if (!user) {
			throw new Error('User not found');
		}
		const decks = await this.mongoAdapter.find();
		return decks.map((deck: OptionalId<DeckEntityInterface>) => {
			const id = deck._id?.toHexString() || deck.id;
			if (!id) throw new Error('Deck id is missing.');
			return { ...deck, id, _id: undefined };
		});
	}

	async importDeck(deck: DeckEntityInterface, userId: string): Promise<DeckEntityInterface> {
		const objectId = await this.mongoAdapter.stringToObjectId(userId);
		const user = await this.mongoAdapter.findOne({ _id: objectId });
		if (!user) {
			throw new Error('User not found');
		}
		const result = await this.mongoAdapter.insertOne(deck);
		if (!result.insertedId) {
			throw new Error('Failed to insert deck.');
		}
		return { ...deck, id: result.insertedId.toHexString() };
	}

	async update(id: string, deck: DeckEntityInterface): Promise<DeckEntityInterface> {
		const objectId = await this.mongoAdapter.stringToObjectId(id);
		const result = await this.mongoAdapter.findOneAndUpdate({ _id: objectId }, deck);
		if (!result) {
			throw new Error('Deck not found');
		}
		return { ...deck, id };
	}
}