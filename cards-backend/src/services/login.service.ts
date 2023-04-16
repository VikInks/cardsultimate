import {UserServiceInterface} from "../domain/interfaces/services/user.service.interface";
import {UserEntitiesInterface} from "../domain/interfaces/entities/user.entities.interface";
import {PassportInterface} from "../domain/interfaces/passport.interface";
import {HasherInterface} from "../domain/interfaces/hasher.interface";
import {LoginInterface} from "../domain/interfaces/login.interface";
import {IRequest} from "../domain/interfaces/requestHandler.interface";

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

	async login(req: IRequest): Promise<{ access_token: string }> {
		const email = req.body.email;
		const password = req.body.password;
		const user: UserEntitiesInterface = await this.userService.findByEmail(email);
		const isValidated = user.isConfirmed;
		if (!user) throw new Error('User not found');
		if (!isValidated) throw new Error('User not validated');
		const isPasswordValid = await this.bcryptAdapter.compare(password, user.password);
		if (!isPasswordValid) throw new Error('Invalid password');
		const payload = {email: email, username: user.username, role: user.role, locality: user.locality};
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