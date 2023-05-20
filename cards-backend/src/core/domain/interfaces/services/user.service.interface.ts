import { UserEntitiesInterface } from '../../endpoints/user.entities.interface';

export interface UserServiceInterface {
    create(item: UserEntitiesInterface): Promise<UserEntitiesInterface>;
    delete(id: string): Promise<boolean>;
    update(
        userToHandle: UserEntitiesInterface,
        requestedUser: UserEntitiesInterface,
        ban?: boolean,
        archive?: boolean
    ): Promise<UserEntitiesInterface>;
    findByEmail(email: string): Promise<UserEntitiesInterface | null>;
    getUnconfirmedUsers(): Promise<UserEntitiesInterface[]>;
    confirmUser(confirmationCode: string): Promise<{ message: string }>;
    deleteUnconfirmedUsers(): Promise<UserEntitiesInterface[]>;
    findByUsername(username: string): Promise<UserEntitiesInterface | null>;
    findById(id: string): Promise<UserEntitiesInterface | null>;
}
