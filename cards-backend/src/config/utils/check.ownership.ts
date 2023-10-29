import {HttpRequest} from "../interfaces/adapters/server.interface";
import {CustomResponse} from "../../framework/error/customResponse";

type checkOwnershipFn = (id: string) => Promise<any>;

/**
 * Check if the user is the owner of the resource
 * @param req HttpRequest
 * @param checkOwnershipFn Function to check ownership of the resource (returns the owner ID)
 * @returns Promise<string> The user ID
 * @throws CustomResponse
 * @example
 * const userId = await checkUserOwnership(req, this.collectionService.getCollectionById);
 * const userId = await checkUserOwnership(req, this.cardService.getCardById);
 * const userId = await checkUserOwnership(req, this.userService.getUserById);
 * const userId = await checkUserOwnership(req, this.userService.getUserByEmail);
 * @see cards-backend/src/application/controllers/collection.controller.ts
 * @author VikInks
 */
export async function checkUserOwnership(req: HttpRequest, checkOwnershipFn: checkOwnershipFn): Promise<string> {
    if (!req.user) throw new CustomResponse(401, 'Unauthorized');
    const userId = req.user.id;
    const role = req.user.role;
    const ownership = await checkOwnershipFn(req.params.id);
    if (role === 'admin') return userId;
    if (userId !== ownership.idOwner) throw new CustomResponse(401, 'Unauthorized access');
    return userId;
}
