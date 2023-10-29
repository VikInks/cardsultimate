import {CollectionControllerInterface} from "../../config/interfaces/controllers/collection.controller.interface";
import {HttpRequest, HttpResponse, NextFunction} from "../../config/interfaces/adapters/server.interface";
import {CustomResponse} from "../../framework/error/customResponse";
import {CollectionServiceInterface} from "../../config/interfaces/services/collection.service.interface";
import {UserServiceInterface} from "../../config/interfaces/services/user.service.interface";
import {Route, Post, Delete, Put, Get} from "../../framework/router/custom/decorator";
import {checkUserOwnership} from "../../config/utils/check.ownership";

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
	 *        403:
	 *	        description: A collection already exists for this user
	 *        500:
	 *          description: Error during collection creation
	 */
	@Post('/create', { middlewares: ['auth'] })
	async createCollection(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> {
		try {
			const userId = req.user?.id ? req.user.id : null;
			if (userId === null) return next(new CustomResponse(401));
			const isCollection = await this.collectionService.getCollectionByOwner(userId);
			if (isCollection) return next(new CustomResponse(403, 'A collection already exists for this user'));
			await this.collectionService.create(userId);
			res.status(200).json({message: "Collection created successfully"});
		} catch (e) {
			next(new CustomResponse(500, 'Error during collection creation'));
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
	async deleteCollection(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> {
		const user = req.user?.id ? req.user.id : null;
		if (user === null) return next(new CustomResponse(401));
		const userId = await checkUserOwnership(req, this.collectionService.getCollectionByOwner);
		const { archivedAt } = await this.userService.findById(userId);
		const collectionId = req.params.id;
		if (archivedAt && archivedAt?.getTime() < Date.now() - 31536000000) {
			try {
				await this.collectionService.delete(collectionId, userId);
				res.status(200).json({message: "Collection deleted successfully"});
			} catch (e) {
				next(new CustomResponse(500, 'Error during collection deletion'));
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
	async getCollection(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> {
		try {
			const collection = await this.collectionService.getCollectionByOwner(req.params.userId);
			res.status(200).json(collection);
		} catch (e) {
			next(new CustomResponse(500, 'Error fetching the collection'));
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
	async updateCollection(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> {
		const userId = await checkUserOwnership(req, this.collectionService.getCollectionByOwner);
		const item = req.body;
		try {
			const collection = await this.collectionService.update(item, req.params.id, userId);
			if(!collection) next(new CustomResponse(500, 'Error updating collection'));
			res.status(200).json(collection);
		} catch (e) {
			next(new CustomResponse(500, 'Error updating collection'));
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
	async setPublic(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> {
		const userId = await checkUserOwnership(req, this.collectionService.getCollectionByOwner);
		try {
			await this.collectionService.publicCanView(userId, req.params.id, req.body.isPrivate);
			res.status(200).json({message: "Collection is now public"});
		} catch (e) {
			next(new CustomResponse(500, 'Error setting collection public'));
		}
	}

	@Post('/sellManagerCollection/:id', { middlewares: ['auth'] })
	async sellManagerCollection(req: HttpRequest, res: HttpResponse, next: NextFunction): Promise<void> {
		const userId = await checkUserOwnership(req, this.collectionService.getCollectionByOwner);
		try {
			const state = await this.collectionService.sellManagerCollection(userId, req.body);
			res.status(200).json({message: `Collection is now ${state ? 'for sale' : 'not for sale'}`});
		} catch (e) {
			next(new CustomResponse(500, 'Error setting collection public'));
		}
	}

	setCardsToExchangeList(req: any, res: any, next: any): Promise<void> {
		return Promise.resolve(undefined);
	}

	setCardsToSellList(req: any, res: any, next: any): Promise<void> {
		return Promise.resolve(undefined);
	}

	setPublicCanView(req: any, res: any, next: any): Promise<void> {
		return Promise.resolve(undefined);
	}
}
