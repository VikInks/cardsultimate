import {UserServiceInterface} from "../domain/interfaces/services/user.service.interface";
import {UserEntitiesInterface} from "../domain/interfaces/endpoints/entities/user.entities.interface";
import {PassportInterface} from "../domain/interfaces/passport.interface";
import {HasherInterface} from "../domain/interfaces/hasher.interface";
import {LoginInterface} from "../domain/interfaces/login.interface";
import {INextFunction} from "../domain/interfaces/requestHandler.interface";

export class LoginService implements LoginInterface {
	private readonly userService: UserServiceInterface;
	private readonly jwtService: PassportInterface;
	private readonly bcryptAdapter: HasherInterface;

	constructor(
		private readonly user: UserServiceInterface,
		private readonly jwt: PassportInterface,
		private readonly bcrypt: HasherInterface,
	) {
		this.userService = user;
		this.jwtService = jwt;
		this.bcryptAdapter = bcrypt;
	}

	async login(email: string, password: string, next: INextFunction): Promise<{ access_token: string }> {
		const user: UserEntitiesInterface | null = await this.userService.findByEmail(email);
		if (!user) throw new Error('User not found');
		const isValidated = user.isConfirmed;
		if (!isValidated) throw new Error('User not validated');
		const isPasswordValid = await this.bcryptAdapter.compare(password, user.password);
		if (!isPasswordValid) throw new Error('Invalid password');
		if(!user.role) throw new Error('Error: user role is not defined');
		if(user.confirmationToken) throw new Error('Error: user is not confirmed');
		const payload = {email: email, username: user.username, role: user.role};
		return {
			access_token: this.jwtService.sign(payload),
		};
	}

	async disconnect(): Promise<{ access_token: null }> {
		return {
			access_token: null,
		};
	}
}