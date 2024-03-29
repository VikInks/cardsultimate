import {UserEntitiesInterface} from "../../../domain/user.entities.interface";


export interface UserServiceInterface {
    create(item: UserEntitiesInterface): Promise<UserEntitiesInterface>;
    delete(id: string): Promise<boolean>;
    update(
        userToHandle: UserEntitiesInterface,
        requestedUser: UserEntitiesInterface,
        ban?: boolean,
        archive?: boolean
    ): Promise<UserEntitiesInterface>;
    findByEmail(email: string): Promise<UserEntitiesInterface>;
    getUnconfirmedUsers(): Promise<UserEntitiesInterface[]>;
    confirmUser(confirmationCode: string): Promise<UserEntitiesInterface & { message: string }>;
    deleteUnconfirmedUsers(): Promise<UserEntitiesInterface[]>;
    findByUsername(username: string): Promise<UserEntitiesInterface>;
	findById(userId: string): Promise<UserEntitiesInterface>;
}
