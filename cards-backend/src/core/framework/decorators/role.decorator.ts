import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {UserServiceInterface} from "../../domain/interfaces/services/user.service.interface";
import {Role} from "../../domain/enums/role.enum";

export const Roles = (...roles: Role[]) => {
	return createParamDecorator(async (data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		const user = request.user;

		// Ici, vous pouvez appeler un service pour récupérer les informations
		// d'autorisation pour l'utilisateur actuel. Par exemple :
		// const userRoles = await myAuthService.getRoles(user);
		// À la place, j'utilise une fonction simulée pour l'exemple.
		const userRoles = getUserRoles(user);

		return roles.some((role) => userRoles.includes(role));
	});
};

// Fonction simulée pour récupérer les rôles d'un utilisateur.
function getUserRoles(user: UserServiceInterface): Role[] {
	// Récupérez les rôles de l'utilisateur ici.
	// Par exemple : return user.roles;
	return [Role.USER];
}
