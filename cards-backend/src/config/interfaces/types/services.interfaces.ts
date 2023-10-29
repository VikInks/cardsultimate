import {UserServiceInterface} from "../services/user.service.interface";
import {LoginServiceInterface} from "../services/login.service.interface";
import {EmailServiceInterface} from "../services/email.service.interface";
import {IdInterface} from "../adapters/id.interface";
import {HasherInterface} from "../adapters/hasher.interface";
import {AuthorizationServiceInterface} from "../services/authorization.service.interface";

export type ServiceInterfaces = {
	userService: UserServiceInterface;
	loginService: LoginServiceInterface;
	emailService: EmailServiceInterface;
	idService: IdInterface;
	hasher: HasherInterface;
	authorizationService: AuthorizationServiceInterface;
};