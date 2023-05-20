import {CollectionControllerInterface} from "../../domain/interfaces/controllers/collection.controller.interface";
import {HttpRequest, HttpResponse} from "../../domain/interfaces/adapters/server.interface";
import {CustomError} from "../../framework/error/customError";
import {CollectionServiceInterface} from "../../domain/interfaces/services/collection.service.interface";
import {UserServiceInterface} from "../../domain/interfaces/services/user.service.interface";
import {CollectionEntityInterface} from "../../domain/endpoints/collection/collection.entity.interface";
import {Route, Post, Delete, Put, Get} from "../../framework/router/custom/decorator";
import {CardsEntityInterface} from "../../domain/endpoints/cards/cards.entity.interface";

@Route('collection')
export class CollectionController implements CollectionControllerInterface {
	constructor(private readonly collectionService: CollectionServiceInterface, private readonly userService: UserServiceInterface) {
		this.collectionService = collectionService;
		this.userService = userService;
	}

	/**
	 * @swagger
	 * /collection/create:
	 *   post:
	 *     security:
	 *     - BearerAuth: []
	 *     tags:
	 *     - collection
	 *     description: Crée une nouvelle collection
	 *     produces:
	 *     - application/json
	 *     parameters:
	 *     - in: body
	 *       name: collection
	 *       description: La collection à créer
	 *       schema:
	 *         $ref: '#/components/schemas/CollectionEntityInterface'
	 *     responses:
	 *       200:
	 *         description: Collection créée avec succès
	 */
	@Post('/create', { middlewares: ['auth'] })
	async createCollection(req: HttpRequest, res: HttpResponse): Promise<void> {
		const user = req.user;
		if (!user) {
			throw new CustomError(500, 'you must create an account to set a new collection');
		}
		const item = req.body;
		try {
			await this.collectionService.create(item, user.id);
			res.status(200).json({message: "Collection created successfully"});
		} catch (e) {
			res.status(500).json('Error creating collection of user, please contact support');
		}
	}

	/**
	 * @swagger
	 * /collection/delete/{id}:
	 *   delete:
	 *     security:
	 *     - BearerAuth: []
	 *     tags:
	 *     - collection
	 *     description: Supprime une collection
	 *     produces:
	 *     - application/json
	 *     parameters:
	 *     - in: path
	 *       name: id
	 *       required: true
	 *       description: L'ID de la collection
	 *       schema:
	 *         $ref: '#/components/schemas/CollectionEntityInterface'
	 *       type: string
	 *     responses:
	 *       200:
	 *         description: Collection supprimée avec succès
	 */
	@Delete('/delete/', { middlewares: ['auth'] })
	async deleteCollection(req: HttpRequest, res: HttpResponse): Promise<void> {
		const userId = req.user?.id || await this.collectionService.getCollectionByOwner(req.params.id).then((collection) => {return collection?.idOwner});
		if(!userId) {
			throw new CustomError(500, 'you must create an account to set a new collection');
		}
		const archivedAt = await this.userService.findById(userId).then((user) => {return user?.archivedAt});
		if (archivedAt && archivedAt.getTime() < Date.now() - 31536000000) {
			const collection = await this.collectionService.getCollectionByOwner(userId);
			if (!collection?.id) {
				throw res.status(500).json('you must create an account to set a new collection');
			}
			try {
				await this.collectionService.delete(collection?.id, userId);
				res.status(200).json({message: "Collection deleted successfully"});
			} catch (e) {
				res.status(500).json('Error deleting collection of user, please contact support');
			}
		}
	}

	/**
	 * @swagger
	 * /collection/get/{id}:
	 *   get:
	 *     security:
	 *     - BearerAuth: []
	 *     tags:
	 *     - collection
	 *     description: Récupère une collection
	 *     produces:
	 *     - application/json
	 *     parameters:
	 *     - in: path
	 *       name: id
	 *       required: true
	 *       description: L'ID de la collection
	 *       schema:
	 *         $ref: '#/components/schemas/CollectionEntityInterface'
	 *       type: string
	 *     responses:
	 *       200:
	 *         description: Collection récupérée avec succès
	 */
	@Get('/get/', { middlewares: ['auth'] })
	async getCollection(req: HttpRequest, res: HttpResponse): Promise<void> {
		const user = req.user?.id;
		const owner = user == await this.collectionService.getCollectionByOwner(req.params.id).then((collection) => {return collection?.idOwner});
		if (!owner|| !user) {
			throw new CustomError(500, 'this is not your collection, you cannot access it');
		}
		try {
			const collection = await this.collectionService.getCollectionByOwner(user);
			res.status(200).json(collection);
		} catch (e) {
			res.status(500).json('Error getting collection of user, please contact support');
		}
	}

	/**
	 * @swagger
	 * /collection/update/{id}:
	 *   put:
	 *     security:
	 *     - BearerAuth: []
	 *     tags:
	 *     - collection
	 *     description: Met à jour une collection
	 *     produces:
	 *     - application/json
	 *     parameters:
	 *     - in: body
	 *       name: collection
	 *       description: La collection à mettre à jour
	 *       schema:
	 *         $ref: '#/components/schemas/CollectionEntityInterface'
	 *     - in: path
	 *       name: id
	 *       required: true
	 *       description: L'ID de la collection
	 *       type: string
	 *     responses:
	 *       200:
	 *         description: Collection mise à jour avec succès
	 */
	@Put('/update/:id', { middlewares: ['auth'] })
	async updateCollection(req: HttpRequest, res: HttpResponse): Promise<CollectionEntityInterface | null> {
		const user = req.user?.id;
		const owner = user == await this.collectionService.getCollectionByOwner(req.params.id).then((collection) => {return collection?.idOwner});
		if (!owner || !user) {
			throw new CustomError(500, 'this is not your collection, you cannot access it');
		}
		const item = req.body as CardsEntityInterface;
		const collectionId = req.params.id;
		try {
			const collection = await this.collectionService.update(item, collectionId, user);
			res.status(200).json(collection);
			return collection;
		} catch (e) {
			res.status(500).json('Error updating collection of user, please contact support');
			return null;
		}
	}
}