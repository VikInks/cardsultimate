import {CollectionServiceInterface} from "../../domain/interfaces/services/collection.service.interface";
import {CollectionRepositoryInterface} from "../../domain/interfaces/repositories/collection.repository.interface";
import {CollectionEntityInterface} from "../../domain/endpoints/collection/collection.entity.interface";
import {CustomError} from "../../framework/error/customError";
import {CardsEntityInterface} from "../../domain/endpoints/cards/cards.entity.interface";
import {IdInterface} from "../../domain/interfaces/adapters/id.interface";

export class CollectionService implements CollectionServiceInterface {
	constructor(private readonly collectionRepository: CollectionRepositoryInterface, private readonly idService: IdInterface) {
		this.collectionRepository = collectionRepository;
	}

	async create(ownerId: string): Promise<CollectionEntityInterface> {
		try {
			const id = this.idService.uuid();
			const cards:CardsEntityInterface[] = [];
			const updateDate = new Date();
			const collection: CollectionEntityInterface = {id: id, idOwner: ownerId, cards: cards, updateDate: updateDate};
			return await this.collectionRepository.create(collection);
		} catch (e) {
			throw new CustomError(500, 'Error creating collection of user, please contact support');
		}
	}

	async delete(id: string, ownerId: string): Promise<boolean> {
		try {
			return await this.collectionRepository.deleteById(id, ownerId);
		} catch (e) {
			throw new CustomError(500, 'Error deleting collection of user, please contact support');
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
			throw new CustomError(500, 'Error updating collection of user, please contact support');
		}
	}

}