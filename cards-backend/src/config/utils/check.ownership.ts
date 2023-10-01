import {HttpRequest} from "../interfaces/adapters/server.interface";
import {CustomResponse} from "../../framework/error/customResponse";

type OwnershipFunction = (id: string) => Promise<{ idOwner: string | null }>;

export async function checkUserOwnership(req: HttpRequest, checkOwnershipFn: OwnershipFunction): Promise<string> {
    if (!req.user) throw new CustomResponse(401, 'Unauthorized');
    const userId = req.user.id;
    const role = req.user.role;
    const ownership = await checkOwnershipFn(req.params.id);
    if (role === 'admin') return userId;
    if (userId !== ownership.idOwner) throw new CustomResponse(401, 'Unauthorized access');
    return userId;
}
