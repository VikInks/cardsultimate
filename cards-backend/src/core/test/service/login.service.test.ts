import { UserService } from "../../application/services/user.service";
import { AuthorizeInterface } from "../../domain/interfaces/adapters/authorize.interface";
import { HasherInterface } from "../../domain/interfaces/adapters/hasher.interface";
import { LoginService } from "../../application/services/login.service";
import {LocalityInformationsInterface} from "../../domain/endpoints/locality.informations.interface";
import {UserEntitiesInterface} from "../../domain/endpoints/user.entities.interface";
import {MockProxy, mock} from "jest-mock-extended";

const  mocked = jest.mocked;

describe('LoginService', () => {
	let userService: MockProxy<UserService>;
	let jwtService: MockProxy<AuthorizeInterface>;
	let bcryptAdapter: MockProxy<HasherInterface>;
	let loginService: LoginService;

	beforeEach(() => {
		userService = mock<UserService>();
		jwtService = mock<AuthorizeInterface>();
		bcryptAdapter = mock<HasherInterface>();
		loginService = new LoginService(userService, jwtService, bcryptAdapter);
	});

	const email = 'test@example.com';
	const password = 'password';
	const id: string = '1';
	const username: string = 'test';
	const firstName: string = 'test';
	const lastName: string = 'test';
	const locality: LocalityInformationsInterface = {
		city: 'test',
		region: 'test',
		country:'test',
		npa: 'test',
		street: 'test',
		streetNumber: 'test'
	}
	const role: string = 'test';
	const archive: boolean = false;
	const banned: boolean = false;
	const createdAt: Date = new Date();
	const updatedAt: Date = new Date();
	const confirmationToken: string | null = null;
	const confirmationExpiresAt: Date | undefined = undefined;
	const isConfirmed: boolean = true;

	const user: UserEntitiesInterface = { id, username, email, firstName, lastName, locality, password, role, archive, banned, createdAt, updatedAt, confirmationToken, confirmationExpiresAt, isConfirmed };

	it('should return a token when the user logs in successfully', async () => {
		mocked(userService.findByEmail).mockResolvedValueOnce(user);
		mocked(bcryptAdapter.compare).mockResolvedValueOnce(true);
		mocked(jwtService.sign).mockReturnValueOnce('fake-token');

		const result = await loginService.login(email, password);

		expect(result).toEqual({ payload: expect.any(Object), access_token: 'fake-token' });
	});
	it("should throw an error when the user doesn't exist", async () => {
		mock(userService.findByEmail).mockResolvedValueOnce(null);
		mock(bcryptAdapter.compare).mockResolvedValueOnce(true);
		mock(jwtService.sign).mockReturnValueOnce('fake-token');

		await expect(loginService.login(email, password)).rejects.toThrowError('User not found');
	});

	it("should throw an error when the password is incorrect", async () => {
		mock(userService.findByEmail).mockResolvedValueOnce(user);
		mock(bcryptAdapter.compare).mockResolvedValueOnce(false);
		mock(jwtService.sign).mockReturnValueOnce('fake-token');

		await expect(loginService.login(email, password)).rejects.toThrowError('Invalid credentials');
	});

	it("should throw an error when the user is not confirmed", async () => {
		user.isConfirmed = false;
		mock(userService.findByEmail).mockResolvedValueOnce(user);
		mock(bcryptAdapter.compare).mockResolvedValueOnce(true);
		mock(jwtService.sign).mockReturnValueOnce('fake-token');

		await expect(loginService.login(email, password)).rejects.toThrowError('User not validated');
	});
});
