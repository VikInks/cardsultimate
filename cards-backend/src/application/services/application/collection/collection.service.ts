import {CollectionServiceInterface} from "../../../../config/interfaces/services/collection.service.interface";
import {CollectionRepositoryInterface} from "../../../../config/interfaces/repositories/collection.repository.interface";
import {CollectionEntityInterface} from "../../../../domain/collection/collection.entity.interface";
import {CardsEntityInterface} from "../../../../domain/cards/cards.entity.interface";
import {IdInterface} from "../../../../config/interfaces/adapters/id.interface";
import {RedisServiceInterface} from "../../../../config/interfaces/services/redis.service.interface";
import {REDIS_TIMER} from "../../../../config/redis.config";

export class CollectionService implements CollectionServiceInterface {

    constructor(
        private readonly collectionRepository: CollectionRepositoryInterface,
        private readonly idService: IdInterface,
        private readonly redisClient: RedisServiceInterface,
    ) {}

    async sellManagerCollection(id: string, ownerId: string): Promise<CollectionEntityInterface | null> {
        try {
            const collection = await this.collectionRepository.getById(id);
            if (collection?.idOwner === ownerId) {
                return await this.collectionRepository.sellManagerCollection(id);
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    async publicCanView(ownerId: string, id: string, isPrivate: boolean): Promise<CollectionEntityInterface | null> {
        try {
            const bool = !isPrivate;
            const collection = await this.collectionRepository.getById(id);
            if (collection?.idOwner === ownerId) {
                return await this.collectionRepository.setViewCollection(id, bool);
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    async create(ownerId: string): Promise<CollectionEntityInterface | null> {
        try {
            const id = this.idService.uuid();
            const cards: CardsEntityInterface[] = [];
            const updateDate = new Date();
            const collection: CollectionEntityInterface = {
                id: id,
                idOwner: ownerId,
                cards: cards,
                updateDate: updateDate,
                isPrivate: true,
                sellManage: false
            };

            const newCollection = await this.collectionRepository.create(collection);
            await this.redisClient.cacheData(`collection:${id}`, newCollection, REDIS_TIMER.ONE_DAY);
            return newCollection;
        } catch (e) {
            return null;
        }
    }

    async delete(id: string, ownerId: string): Promise<void | null> {
        try {
            const verified = await this.collectionRepository.getById(id);
            if (verified?.idOwner !== ownerId) {
                const deleteCollection = await this.collectionRepository.deleteById(id, ownerId);
                await this.redisClient.deleteCachedData(`collection:${id}`);
                return deleteCollection;
            }
        } catch (e) {
            return null;
        }
    }

    async getCollectionByOwner(idOwner: string): Promise<CollectionEntityInterface | null> {
        try {
            const collection = await this.collectionRepository.getById(idOwner)
            await this.redisClient.cacheData(`collection:${collection?.id}`, collection, REDIS_TIMER.ONE_HOUR);
            return collection;
        } catch (e) {
            return null;
        }
    }

    async update(item: CardsEntityInterface[], collectionId: string, ownerId: string): Promise<CollectionEntityInterface | null> {
        try {
            const updateCollection = await this.collectionRepository.update(item, collectionId, ownerId);
            await this.redisClient.cacheData(`collection:${updateCollection.id}`, updateCollection, REDIS_TIMER.ONE_DAY);
            return updateCollection;
        } catch (e) {
            return null;
        }
    }
}