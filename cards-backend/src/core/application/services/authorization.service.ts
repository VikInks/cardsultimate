import { AuthorizationServiceInterface } from '../../domain/interfaces/services/authorization.service.interface';
import { UserServiceInterface } from '../../domain/interfaces/services/user.service.interface';
import { UserEntitiesInterface } from '../../domain/endpoints/user.entities.interface';
import { TokenInterface } from '../../domain/interfaces/adapters/token.interface';
import {Service} from "../../../libraries/custom/injects/frameworks/decorators/types.decorators";

@Service()
export default class AuthorizationService implements AuthorizationServiceInterface {
    constructor(
        private readonly userService: UserServiceInterface,
        private readonly token: TokenInterface
    ) {}

    async verifyToken(token: string): Promise<UserEntitiesInterface | null> {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('No secret provided');
        try {
            const decoded = this.token.verify(
                token,
                secret
            ) as UserEntitiesInterface;
            return await this.userService.findByEmail(decoded.email);
        } catch (error) {
            return null;
        }
    }

    async isAdmin(user: UserEntitiesInterface): Promise<boolean> {
        return user.role === 'admin';
    }

    async isSuperUser(user: UserEntitiesInterface): Promise<boolean> {
        return user.role === 'superuser';
    }

    async isAuthenticated(user: UserEntitiesInterface): Promise<boolean> {
        return !!user;
    }
}
