import {UserEntitiesInterface} from "../endpoints/entities/user.entities.interface";

export interface UserServiceInterface {
	create(item: UserEntitiesInterface): Promise<UserEntitiesInterface>;
	delete(id: string): Promise<boolean>;
	update(id: string, item: UserEntitiesInterface): Promise<UserEntitiesInterface>;
	findByEmail(email: string): Promise<UserEntitiesInterface>;
	getUnconfirmedUsers(): Promise<UserEntitiesInterface[]>;
	confirmUser(confirmationCode: string): Promise<UserEntitiesInterface>;
	deleteUnconfirmedUsers(): Promise<UserEntitiesInterface[]>;
}
