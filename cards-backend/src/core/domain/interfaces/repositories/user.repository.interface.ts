import {UserEntitiesInterface as User} from "../../endpoints/user.entities.interface";
import {BaseRepositoryInterface} from "./base.repository.interface";

export interface UserRepositoryInterface extends BaseRepositoryInterface<User> {
	// inherited from BaseRepositoryInterface
	create(user: User): Promise<User>;
	findById(id: string): Promise<User | null>;
	update(id: string, user: User): Promise<User>;
	deleteById(id: string): Promise<boolean>;
	findAll(): Promise<User[]>;

	// custom methods
	findUserByEmail(email: string): Promise<User | null>;
	getUserByEmail(email: string): Promise<User | null>;
	getUserById(id: string): Promise<User | null>;
	findUserByConfirmationCode(confirmationCode: string): Promise<User | null>;
	findUnconfirmedUsersWithExpiredLinks(): Promise<User[]>;
	findByRole(role: string): Promise<User| null>;
}