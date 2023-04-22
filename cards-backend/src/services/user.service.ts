import { UserEntitiesInterface } from '../domain/interfaces/endpoints/entities/user.entities.interface';
import {EmailServiceInterface} from "../domain/interfaces/services/emailServiceInterface";
import {UserServiceInterface} from "../domain/interfaces/services/user.service.interface";
import {UserRepositoryInterface} from "../domain/interfaces/repositories/user.repository.interface";
import {CustomError} from "../main/error/customError";

export class UserService implements UserServiceInterface {
	private readonly userRepository: UserRepositoryInterface;
	private mailService: EmailServiceInterface;

	constructor(private readonly repository : UserRepositoryInterface, private readonly email : EmailServiceInterface) {
		this.userRepository = repository;
		this.mailService = email;
	}

	async findByEmail(email: string): Promise<UserEntitiesInterface | null> {
		let user = await this.userRepository.findUserByEmail(email);
		console.log(`user find: ${user?.email}`);
		if (!user) {
			user = null
		}
		return user;
	}

	async deleteUnconfirmedUsers(): Promise<UserEntitiesInterface[]> {
		const expiredUsers = await this.userRepository.findUnconfirmedUsersWithExpiredLinks();

		for (const user of expiredUsers) {
			if(user.id) await this.userRepository.deleteById(user.id);
		}
		return expiredUsers;
	}

	async getUnconfirmedUsers(): Promise<UserEntitiesInterface[]> {
		return await this.userRepository.findUnconfirmedUsersWithExpiredLinks();
	}

	async confirmUser(confirmationCode: string): Promise<{message: string}> {
		const user = await this.userRepository.findUserByConfirmationCode(confirmationCode);
		console.log(`user confirmation token find: ${user?.confirmationToken}`);
		if (!user) {
			throw new CustomError(404, 'Invalid confirmation code');
		}

		if (user.isConfirmed) {
			throw new CustomError(400, 'User is already confirmed');
		}

		if (user.confirmationExpiresAt && user.confirmationExpiresAt < new Date()) {
			throw new CustomError(400, 'Confirmation link has expired');
		}

		user.isConfirmed = true;
		user.confirmationExpiresAt = undefined;
		user.confirmationToken = null;

		const userSave = await this.userRepository.update(user.id, user);
		console.log(`userSave: ${userSave}`);

		return { message: 'User confirmed successfully'}
	}

	async create(item: UserEntitiesInterface): Promise<UserEntitiesInterface> {
		const confirmationExpiresIn = 24 * 60 * 60 * 1000; // 24 hours
		const confirmationExpiresAt = new Date(Date.now() + confirmationExpiresIn);
		const user =
			{...item};
		user.role = 'user';
		user.archive = false;
		user.banned = false;
		user.createdAt = new Date();
		user.updatedAt = new Date();
		user.isConfirmed = false;
		user.confirmationExpiresAt = confirmationExpiresAt;
		await this.userRepository.create(user).then(user => {
			if (!user) {
				throw new Error('User not created');
			}
			return user;
		});
		return user;
	}

	async delete(id: string): Promise<boolean> {
		return this.userRepository.deleteById(id);
	}

	async findAll(): Promise<UserEntitiesInterface[]> {
		const users = this.userRepository.findAll();
		return Promise.resolve(users);
	}

	async findOne(id: string): Promise<UserEntitiesInterface | null> {
		return this.userRepository.findById(id).then(user => {
			if (!user) {
				throw new Error('User not found');
			}
			return user;
		});
	}

	async update(id: string, item: UserEntitiesInterface): Promise<UserEntitiesInterface> {
		const user = await this.userRepository.findUserByEmail(item.email);
		// Verify that the user is the owner of the account information being updated or is a superuser or admin
		if (!user) {
			throw new Error('User not found');
		}
		if (user.id !== id && user.role !== 'superuser' && user.role !== 'admin') {
			throw new Error('You are not authorized to update this user');
		}

		// Check if the user is not an admin or superuser and trying to update ban or archive status
		if (user.role !== 'superuser' && user.role !== 'admin' && (item.hasOwnProperty('banned') || item.hasOwnProperty('archived'))) {
			throw new Error('You are not authorized to update ban or archive status');
		}

		const userUpdate = {...user, ...item};
		return this.userRepository.update(id, userUpdate);
	}

	// async checkPassword(password: string, password2: string): Promise<boolean> {
	// 	if(password !== password2) {
	// 		throw new Error('Passwords do not match');
	// 	}
	// 	return Promise.resolve(true);
	// }
}
