import {UserEntitiesInterface} from "../../endpoints/user.entities.interface";

export interface UserServiceInterface {
	create(item: UserEntitiesInterface): Promise<UserEntitiesInterface>;
	delete(id: string): Promise<boolean>;
	update(id: string, item: UserEntitiesInterface): Promise<UserEntitiesInterface>;
	findByEmail(email: string): Promise<UserEntitiesInterface | null>;
	getUnconfirmedUsers(): Promise<UserEntitiesInterface[]>;
	confirmUser(confirmationCode: string): Promise<{message:string}>;
	deleteUnconfirmedUsers(): Promise<UserEntitiesInterface[]>;
}
