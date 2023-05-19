import {LoginServiceInterface} from "../../domain/interfaces/services/login.service.interface";
import {UserServiceInterface} from "../../domain/interfaces/services/user.service.interface";
import {AuthorizeInterface} from "../../domain/interfaces/adapters/authorize.interface";
import {HasherInterface} from "../../domain/interfaces/adapters/hasher.interface";


export class LoginService implements LoginServiceInterface {

	constructor(
		private readonly userService: UserServiceInterface,
		private readonly jwtService: AuthorizeInterface,
		private readonly bcryptAdapter: HasherInterface,
	) {}

	async login(email: string, password: string): Promise<{ payload: object, access_token: string }> {
		const user = await this.userService.findByEmail(email);
		if (!user) throw new Error("User not found");
		const isValidated = user.isConfirmed;
		if (!isValidated) throw new Error("User not validated");
		const isPasswordValid = await this.bcryptAdapter.compare(password, user.password);
		if (!isPasswordValid) throw new Error("Invalid credentials");
		if (user.banned) throw new Error("User is banned");
		if (user.archive) throw new Error("User is archived");
		const payload = {email: email, username: user.username, role: user.role};
		const token = this.jwtService.sign(payload);
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