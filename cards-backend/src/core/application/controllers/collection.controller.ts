import {CollectionControllerInterface} from "../../domain/interfaces/controllers/collection.controller.interface";
import {HttpRequest, HttpResponse} from "../../domain/interfaces/adapters/server.interface";
import {CustomResponse} from "../../framework/error/customResponse";
import {CollectionServiceInterface} from "../../domain/interfaces/services/collection.service.interface";
import {UserServiceInterface} from "../../domain/interfaces/services/user.service.interface";
import {CollectionEntityInterface} from "../../domain/endpoints/collection/collection.entity.interface";
import {Route, Post, Delete, Put, Get} from "../../framework/router/custom/decorator";

/**
 * @swagger
 * tags:
 *   name: Collection
 *   description: Collection management
 */
@Route('collection')
export class CollectionController implements CollectionControllerInterface {

	constructor(
		private readonly collectionService: CollectionServiceInterface,
		private readonly userService: UserServiceInterface
	) {}

	private async checkUserOwnership(req: HttpRequest): Promise<string> {
		const userId = req.user?.id;
		const role = req.user?.role;
		const ownerId = await this.collectionService.getCollectionByOwner(req.params.id);
		console.log(userId)
		console.log(role)
		console.log(ownerId)
		if (role === 'admin') return userId as string;
		if ((role !== 'admin' && role !== 'user') || (userId !== ownerId?.idOwner)) throw new CustomResponse(401, 'Unauthorized access to collection');
		return userId as string;
	}

	/**
	 * @swagger
	 *  /collection/create:
	 *    post:
	 *      summary: Create a collection
	 *      tags: [Collection]
	 *      security:
	 *        - bearerAuth: []
	 *      responses:
	 *        200:
	 *          description: Collection created successfully
	 *        401:
	 *          description: Unauthorized access to collection
	 *        500:
	 *          description: Error during collection creation
	 */
	@Post('/create', { middlewares: ['auth'] })
	async createCollection(req: HttpRequest, res: HttpResponse): Promise<void> {
		console.log('Prout de kaiser');
		const userId = await this.checkUserOwnership(req);
		try {
			await this.collectionService.create(userId);
			res.status(200).json({message: "Collection created successfully"});
		} catch (e) {
			throw new CustomResponse(500, 'Error during collection creation');
		}
	}

	/**
	 * @swagger
	 *  /collection/delete/{id}:
	 *    delete:
	 *      summary: Delete a collection by ID
	 *      tags: [Collection]
	 *      security:
	 *        - bearerAuth: []
	 *      parameters:
	 *        - in: path
	 *          name: id
	 *          required: true
	 *          description: ID of the collection to delete
	 *      responses:
	 *        200:
	 *          description: Collection deleted successfully
	 *        401:
	 *          description: Unauthorized access to collection
	 *        500:
	 *          description: Error during collection deletion
	 */
	@Delete('/delete/:id', { middlewares: ['auth'] })
	async deleteCollection(req: HttpRequest, res: HttpResponse): Promise<void> {
		const userId = await this.checkUserOwnership(req);
		const { archivedAt } = await this.userService.findById(userId);
		const collectionId = req.params.id;
		if (archivedAt && archivedAt?.getTime() < Date.now() - 31536000000) {
			try {
				await this.collectionService.delete(collectionId, userId);
				res.status(200).json({message: "Collection deleted successfully"});
			} catch (e) {
				throw new CustomResponse(500, 'Error during collection deletion');
			}
		}
	}

	/**
	 * @swagger
	 *  /collection/getCollection/:
	 *    get:
	 *      summary: Get a collection by owner ID
	 *      tags: [Collection]
	 *      security:
	 *        - bearerAuth: []
	 *      responses:
	 *        200:
	 *          description: Returns the collection
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: '#/components/schemas/CollectionEntityInterface'
	 *        401:
	 *          description: Unauthorized access to collection
	 *        500:
	 *          description: Error fetching the collection
	 */
	@Get('/getCollection/{userId}', { middlewares: ['auth'] })
	async getCollection(req: HttpRequest, res: HttpResponse): Promise<void> {
		try {
			const collection = await this.collectionService.getCollectionByOwner(req.params.userId);
			res.status(200).json(collection);
		} catch (e) {
			throw new CustomResponse(500, 'Error fetching the collection');
		}
	}


	/**
	 * @swagger
	 *  /collection/update/{id}:
	 *    put:
	 *      summary: Update a collection by ID
	 *      tags: [Collection]
	 *      security:
	 *        - bearerAuth: []
	 *      parameters:
	 *        - in: path
	 *          name: id
	 *          required: true
	 *          description: ID of the collection to update
	 *      requestBody:
	 *        required: true
	 *        content:
	 *          application/json:
	 *            schema:
	 *              $ref: '#/components/schemas/CollectionEntityInterface'
	 *      responses:
	 *        200:
	 *          description: Returns the updated collection
	 *          content:
	 *            application/json:
	 *              schema:
	 *                $ref: '#/components/schemas/CollectionEntityInterface'
	 *        401:
	 *          description: Unauthorized access to collection
	 *        500:
	 *          description: Error updating collection
	 */
	@Put('/update/:id', { middlewares: ['auth'] })
	async updateCollection(req: HttpRequest, res: HttpResponse): Promise<CollectionEntityInterface | null> {
		const userId = await this.checkUserOwnership(req);
		const item = req.body;
		try {
			const collection = await this.collectionService.update(item, req.params.id, userId);
			res.status(200).json(collection);
			return collection;
		} catch (e) {
			throw new CustomResponse(500, 'Error updating collection');
		}
	}

	/**
	 * @swagger
	 *  /collection/setPublic/{id}:
	 *    post:
	 *      summary: Set collection visibility to public
	 *      tags: [Collection]
	 *      security:
	 *        - bearerAuth: []
	 *      parameters:
	 *        - in: path
	 *          name: id
	 *          required: true
	 *          description: ID of the collection to set visibility
	 *      requestBody:
	 *        required: true
	 *        content:
	 *          application/json:
	 *            schema:
	 *              type: object
	 *              properties:
	 *                isPrivate:
	 *                  type: boolean
	 *                  description: A flag to determine if the collection should be private. Set to 'true' to make the collection private and 'false' otherwise.
	 *      responses:
	 *        200:
	 *          description: Collection is now public
	 *          content:
	 *            application/json:
	 *              schema:
	 *                type: object
	 *                properties:
	 *                  message:
	 *                    type: string
	 *                    example: Collection is now public
	 *        401:
	 *          description: Unauthorized access to collection
	 *        500:
	 *          description: Error setting collection public
	 */
	@Post('/setPublic/:id', { middlewares: ['auth'] })
	async setPublic(req: HttpRequest, res: HttpResponse): Promise<void> {
		const userId = await this.checkUserOwnership(req);
		try {
			await this.collectionService.publicCanView(userId, req.params.id, req.body.isPrivate);
			res.status(200).json({message: "Collection is now public"});
		} catch (e) {
			throw new CustomResponse(500, 'Error setting collection public');
		}
	}
}
