import { AuthorizationServiceInterface } from '../../../config/interfaces/services/authorization.service.interface';
import { UserServiceInterface } from '../../../config/interfaces/services/user.service.interface';
import { UserEntitiesInterface } from '../../../domain/user.entities.interface';
import { TokenInterface } from '../../../config/interfaces/adapters/token.interface';

export class AuthorizationService implements AuthorizationServiceInterface {
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
