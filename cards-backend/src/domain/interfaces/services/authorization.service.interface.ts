import {UserEntitiesInterface} from "../endpoints/entities/user.entities.interface";

export interface AuthorizationServiceInterface {
	verifyToken(token: string): Promise<UserEntitiesInterface | null>;
	isAdmin(user: UserEntitiesInterface): Promise<boolean>;
	isSuperUser(user: UserEntitiesInterface): Promise<boolean>;
}
