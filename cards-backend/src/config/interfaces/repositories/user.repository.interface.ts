
import {BaseRepositoryInterface} from "./base.repository.interface";
import {UserEntitiesInterface} from "../../../domain/user.entities.interface";

export interface UserRepositoryInterface extends BaseRepositoryInterface<UserEntitiesInterface> {
	// inherited from BaseRepositoryInterface
	create(user: UserEntitiesInterface): Promise<UserEntitiesInterface>;
	findById(id: string): Promise<UserEntitiesInterface | null>;
	update(id: string, user: UserEntitiesInterface): Promise<UserEntitiesInterface>;
	deleteById(id: string): Promise<boolean>;
	findAll(): Promise<UserEntitiesInterface[]>;

	// custom methods
	findUserByEmail(email: string): Promise<UserEntitiesInterface | null>;
	getUserByEmail(email: string): Promise<UserEntitiesInterface | null>;
	getUserById(id: string): Promise<UserEntitiesInterface | null>;
	findUserByConfirmationCode(confirmationCode: string): Promise<UserEntitiesInterface | null>;
	findUnconfirmedUsersWithExpiredLinks(): Promise<UserEntitiesInterface[]>;
	findByRole(role: string): Promise<UserEntitiesInterface| null>;
	findUserByUsername(username: string): Promise<UserEntitiesInterface | null>;
}