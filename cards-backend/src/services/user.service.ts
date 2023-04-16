import { UserEntitiesInterface } from '../domain/interfaces/entities/user.entities.interface';
import {EmailServiceInterface} from "../domain/interfaces/services/emailServiceInterface";
import {UserServiceInterface} from "../domain/interfaces/services/user.service.interface";
import {UserRepositoryInterface} from "../domain/interfaces/repositories/user.repository.interface";

export class UserService implements UserServiceInterface {
	private readonly userRepository: UserRepositoryInterface;
	private mailService: EmailServiceInterface;

	constructor(private readonly repository : UserRepositoryInterface, private readonly email : EmailServiceInterface) {
		this.userRepository = repository;
		this.mailService = email;
	}

	async findByEmail(email: string): Promise<UserEntitiesInterface> {
		const user = await this.userRepository.findUserByEmail(email);
		if (!user) {
			throw new Error('User not found');
		}
		return user;
	}

	async deleteUnconfirmedUsers(): Promise<UserEntitiesInterface[]> {
		// Find unconfirmed users with expired confirmation links
		const expiredUsers = await this.userRepository.findUnconfirmedUsersWithExpiredLinks();

		// Delete expired users
		for (const user of expiredUsers) {
			await this.userRepository.deleteById(user.id);
		}
		return expiredUsers;
	}

	async getUnconfirmedUsers(): Promise<UserEntitiesInterface[]> {
		return await this.userRepository.findUnconfirmedUsersWithExpiredLinks();
	}

	async confirmUser(confirmationCode: string): Promise<UserEntitiesInterface> {
		const user = await this.userRepository.findUserByConfirmationCode(confirmationCode);

		if (!user) {
			throw new Error('Invalid confirmation code');
		}

		if (user.isConfirmed) {
			throw new Error('User is already confirmed');
		}

		if (user.confirmationExpiresAt && user.confirmationExpiresAt < new Date()) {
			throw new Error('Confirmation link has expired');
		}

		user.isConfirmed = true;
		user.confirmationExpiresAt = undefined;
		user.confirmationToken = null;

		return this.userRepository.update(user.id, user);
	}

	async create(item: UserEntitiesInterface): Promise<UserEntitiesInterface> {
		const confirmationExpiresIn = 24 * 60 * 60 * 1000; // 24 hours
		const confirmationExpiresAt = new Date(Date.now() + confirmationExpiresIn);
		const user = {...item}
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
}
