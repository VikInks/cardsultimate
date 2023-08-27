import {CollectionEntityInterface as Collection} from "../../domain/endpoints/collection/collection.entity.interface";
import {CollectionRepositoryInterface} from "../../domain/interfaces/repositories/collection.repository.interface";
import {DatabaseInterface} from "../../domain/interfaces/adapters/database.interface";
import {CardsEntityInterface} from "../../domain/endpoints/cards/cards.entity.interface";

export class CollectionRepository implements CollectionRepositoryInterface {
    constructor(private readonly mongoAdapter: DatabaseInterface<Collection>) {
    }

    async addCardToCollection(collectionId: string, card: CardsEntityInterface, user: string): Promise<Collection> {
        const objectId = this.mongoAdapter.stringToObjectId(collectionId);
        const result = await this.mongoAdapter.findOneAndUpdate(
            {_id: objectId, owner: user},
            {$push: {cards: card}},
            {returnOriginal: false}
        );
        if (!result) {
            throw new Error('Collection not found');
        }
        return result;
    }

    // generic methods
    async create(collection: Collection): Promise<Collection> {
        const result = await this.mongoAdapter.insertOne(collection);
        if (!result.insertedId) {
            throw new Error('Failed to insert collection.');
        }
        return {...collection, id: result.insertedId.toHexString()};
    }

    async findById(id: string): Promise<Collection | null> {
        const objectId = this.mongoAdapter.stringToObjectId(id);
        const collection = await this.mongoAdapter.findOne({_id: objectId});
        if (!collection) {
            throw new Error('Collection not found');
        }
        return collection;
    }

    async update(item: CardsEntityInterface, collectionId: string, ownerId: string): Promise<Collection> {
        const objectId = this.mongoAdapter.stringToObjectId(collectionId);
        const result = await this.mongoAdapter.findOneAndUpdate(
            {_id: objectId, owner: ownerId},
            {$push: {cards: item}},
            {returnOriginal: false}
        );
        if (!result) {
            throw new Error('Collection not found');
        }
        return result;
    }


    async deleteById(id: string): Promise<boolean> {
        const objectId = this.mongoAdapter.stringToObjectId(id);
        return await this.mongoAdapter.deleteOne({id: objectId});
    }

    findAll(): Promise<Collection[]> {
        return Promise.resolve([]);
    }

    async getById(ownerId: string): Promise<Collection | null> {
        const objectId = this.mongoAdapter.stringToObjectId(ownerId);
        return await this.mongoAdapter.findOne({owner: objectId});
    }
}