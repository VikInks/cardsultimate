import {UserServiceInterface} from "../services/user.service.interface";
import {LoginServiceInterface} from "../services/login.service.interface";
import {EmailServiceInterface} from "../services/emailServiceInterface";
import {IdInterface} from "../id.interface";
import {HasherInterface} from "../hasher.interface";

export type ServiceInterfaces = {
	userService: UserServiceInterface;
	loginService: LoginServiceInterface;
	emailService: EmailServiceInterface;
	idService: IdInterface;
	hasher: HasherInterface;
};