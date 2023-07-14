import {UserService} from "../../application/services/user.service";
import {AuthorizeInterface} from "../../domain/interfaces/adapters/authorize.interface";
import {HasherInterface} from "../../domain/interfaces/adapters/hasher.interface";
import {LoginService} from "../../application/services/login.service";
import {MockProxy, mock} from "jest-mock-extended";
import * as testData from '../ressources/test.data.json';

const mocked = jest.mocked;

describe('LoginService', () => {
	let userService: MockProxy<UserService>;
	let jwtService: MockProxy<AuthorizeInterface>;
	let bcryptAdapter: MockProxy<HasherInterface>;
	let loginService: LoginService;

	const user = {
		...testData.user,
		createdAt: new Date(),
		updatedAt: new Date(),
		confirmationExpiresAt: new Date()
	};

	beforeEach(() => {
		userService = mock<UserService>();
		jwtService = mock<AuthorizeInterface>();
		bcryptAdapter = mock<HasherInterface>();
		loginService = new LoginService(userService, jwtService, bcryptAdapter);

		mock(userService.create).mockResolvedValueOnce(user);
		mock(userService.findByEmail).mockResolvedValueOnce(user);
		mock(bcryptAdapter.compare).mockResolvedValueOnce(true);
		mock(jwtService.sign).mockReturnValueOnce('token');
	});

	it('should login user', async () => {
		const result = await loginService.login(user.email, user.password);
		expect(result).toEqual({
			payload: {email: user.email, username: user.username, role: user.role},
			access_token: 'token'
		});
	});

	it('should disconnect user', async () => {
		const result = await loginService.disconnect();
		expect(result).toEqual({
			access_token: null
		});
	});
});
