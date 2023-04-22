import {UserServiceInterface} from "../domain/interfaces/services/user.service.interface";
import {UserEntitiesInterface} from "../domain/interfaces/endpoints/entities/user.entities.interface";
import {PassportInterface} from "../domain/interfaces/passport.interface";
import {HasherInterface} from "../domain/interfaces/hasher.interface";
import {LoginServiceInterface} from "../domain/interfaces/services/login.service.interface";

export class LoginService implements LoginServiceInterface {
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

	async login(email: string, password: string): Promise<{ access_token: string } | null> {
		const user: UserEntitiesInterface | null = await this.userService.findByEmail(email);
		if (!user) return null;
		const isValidated = user.isConfirmed;
		if (!isValidated) return null;
		const isPasswordValid = await this.bcryptAdapter.compare(password, user.password);
		if (!isPasswordValid) return null;
		if(!user.role) return null;
		if(user.confirmationToken) return null;
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