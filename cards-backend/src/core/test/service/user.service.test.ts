import {UserService} from "../../application/services/application/user.service";
import {AuthorizeInterface} from "../../domain/interfaces/adapters/authorize.interface";
import {HasherInterface} from "../../domain/interfaces/adapters/hasher.interface";
import {LoginService} from "../../application/services/application/login.service";
import {MockProxy, mock} from "jest-mock-extended";
import * as testData from "../ressources/test.data.json";

const mocked = jest.mocked;


describe('UserService', () => {
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

	const userUpdate = {
		...testData.user,
		email: testData.userUpdate.email,
		createdAt: new Date(),
		updatedAt: new Date(),
		confirmationExpiresAt: new Date()
	}

	const userBan = {
		...testData.user,
		banned: testData.userUpdateBan.banned,
		createdAt: new Date(),
		updatedAt: new Date(),
		confirmationExpiresAt: new Date()
	}

	const userArchive = {
		...testData.user,
		archived: testData.userUpdateArchive.archive,
		createdAt: new Date(),
		updatedAt: new Date(),
		confirmationExpiresAt: new Date()
	}

	const tokenToConfirm = {
		...testData.user,
		confirmationToken: 'token',
	}

	beforeEach(() => {
		userService = mock<UserService>();
		jwtService = mock<AuthorizeInterface>();
		bcryptAdapter = mock<HasherInterface>();
		loginService = new LoginService(userService, jwtService, bcryptAdapter);

		mock(userService.create).mockResolvedValueOnce(user);
		mock(userService.findByEmail).mockResolvedValueOnce(user);
		mock(userService.findByUsername).mockResolvedValueOnce(user);
		mock(userService.update).mockResolvedValueOnce(user);
		mock(userService.confirmUser).mockResolvedValueOnce(testData.tokenConfirmation);

		mock(bcryptAdapter.compare).mockResolvedValueOnce(true);
		mock(jwtService.sign).mockReturnValueOnce('token');
	});

	it('should create user', async () => {
		const result = await userService.create(user);
		expect(result).toEqual(user);
	});

	it('should find user by email', async () => {
		const result = await userService.findByEmail(user.email);
		expect(result).toEqual(user);
	});

	it('should find user by username', async () => {
		const result = await userService.findByUsername(user.username);
		expect(result).toEqual(user);
	});

	it('should update an user', async () => {
		const result = await userService.update(userUpdate, user);
		expect(result).toEqual(user);
	});

	it('should ban an user', async () => {
		const result = await userService.update(user, user, userBan.banned);
		expect(result).toEqual(user);
	});

	it('should archive an user', async () => {
		const result = await userService.update(user, user, userArchive.archived);
		expect(result).toEqual(user);
	});

	it('should confirm user token', async () => {
		const result = await userService.confirmUser(tokenToConfirm.confirmationToken);
		expect(result).toEqual(testData.tokenConfirmation);
	});

	it('should indicate user is already confirmed', async () => {
		await userService.confirmUser(tokenToConfirm.confirmationToken);
		const result = await userService.confirmUser(tokenToConfirm.confirmationToken);
		expect(result).toEqual(testData.tokenConfirmed);
	});
});