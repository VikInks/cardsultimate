import {LoginServiceInterface} from "../../domain/interfaces/services/login.service.interface";
import {UserServiceInterface} from "../../domain/interfaces/services/user.service.interface";
import {PassportInterface} from "../../domain/interfaces/adapters/passport.interface";
import {HasherInterface} from "../../domain/interfaces/adapters/hasher.interface";
import cookieParser from "cookie-parser";


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

	async login(email: string, password: string): Promise<{payload: object, access_token: string }> {
		const user = await this.userService.findByEmail(email);
		if (!user) throw new Error("User not found");
		const isValidated = user.isConfirmed;
		if (!isValidated) throw new Error("User not validated");
		const isPasswordValid = await this.bcryptAdapter.compare(password, user.password);
		if (!isPasswordValid) throw new Error("Invalid credentials");
		const payload = {email: email, username: user.username, role: user.role};
		const token = this.jwtService.sign(payload);
		console.log(token);
		return {
			payload,
			access_token: token
		};
	}

	async disconnect(): Promise<{ access_token: null }> {
		return {
			access_token: null,
		};
	}
}