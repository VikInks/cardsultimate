import jwt from "jsonwebtoken";
import {AuthorizationServiceInterface} from "../domain/interfaces/services/authorization.service.interface";
import {UserServiceInterface} from "../domain/interfaces/services/user.service.interface";
import {UserEntitiesInterface} from "../domain/interfaces/endpoints/entities/user.entities.interface";


export class AuthorizationService implements AuthorizationServiceInterface {
	constructor(private userService: UserServiceInterface) {}

	async verifyToken(token: string): Promise<UserEntitiesInterface | null> {
		const secret = process.env.JWT_SECRET;
		if (!secret) throw new Error('No secret provided');
		try {
			const decoded = jwt.verify(token, secret) as UserEntitiesInterface;
			return await this.userService.findByEmail(decoded.email);
		} catch (error) {
			return null;
		}
	}

	async isAdmin(user: UserEntitiesInterface): Promise<boolean> {
		return user.role === "admin";
	}

	async isSuperUser(user: UserEntitiesInterface): Promise<boolean> {
		return user.role === "superuser";
	}
}
