import {CollectionServiceInterface} from "../../domain/interfaces/services/collection.service.interface";
import {CollectionRepositoryInterface} from "../../domain/interfaces/repositories/collection.repository.interface";
import {CollectionEntityInterface} from "../../domain/endpoints/collection/collection.entity.interface";
import {CustomError} from "../../framework/error/customError";
import {CardsEntityInterface} from "../../domain/endpoints/cards/cards.entity.interface";

export class CollectionService implements CollectionServiceInterface {
	constructor(private readonly collectionRepository: CollectionRepositoryInterface) {
		this.collectionRepository = collectionRepository;
	}

	async create(item: CollectionEntityInterface, ownerId: string): Promise<CollectionEntityInterface> {
		try {
			return await this.collectionRepository.create(item, ownerId);
		} catch (e) {
			throw new CustomError(500, 'Error creating collection of user ${ownerId}, please contact support');
		}
	}

	async delete(id: string, ownerId: string): Promise<boolean> {
		try {
			return await this.collectionRepository.deleteById(id, ownerId);
		} catch (e) {
			throw new CustomError(500, 'Error deleting collection of user ${ownerId}, please contact support');
		}
	}

	async getCollectionByOwner(idOwner: string): Promise<CollectionEntityInterface | null> {
		try {
			return await this.collectionRepository.getById(idOwner)
		} catch (e) {
			throw new CustomError(500, 'Error getting collection of user ${idOwner}, please contact support');
		}
	}

	async update(item: CardsEntityInterface, collectionId: string, ownerId: string): Promise<CollectionEntityInterface> {
		try {
			return await this.collectionRepository.update(item, collectionId, ownerId);
		} catch (e) {
			throw new CustomError(500, 'Error updating collection of user ${ownerId}, please contact support');
		}
	}

}