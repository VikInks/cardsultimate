import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {UserServiceInterface} from "../../domain/interfaces/services/user.service.interface";
import {Role} from "../../domain/enums/role.enum";

export const Roles = (...roles: Role[]) => {
	return createParamDecorator(async (data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		const user = request.user;

		const userRoles = getUserRoles(user);

		return roles.some((role) => userRoles.includes(role));
	});
};

// Fonction simulée pour récupérer les rôles d'un utilisateur.
function getUserRoles(user: UserServiceInterface): Role[] {

	return [Role.USER];
}
