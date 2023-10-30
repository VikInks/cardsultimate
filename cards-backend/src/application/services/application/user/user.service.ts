import {UserServiceInterface} from '../../../../config/interfaces/services/user.service.interface';
import {UserRepositoryInterface} from '../../../../config/interfaces/repositories/user.repository.interface';
import {UserEntitiesInterface} from '../../../../domain/user.entities.interface';
import {CustomResponse} from '../../../../framework/error/customResponse';
import {HasherInterface} from "../../../../config/interfaces/adapters/hasher.interface";
import {IdService} from "../id/id.service";
import {WebSocketServerInterface} from "../../../../config/interfaces/services/websocket.interface";

export class UserService implements UserServiceInterface {

	constructor(
		private readonly userRepository: UserRepositoryInterface,
		private readonly hasher: HasherInterface,
		private readonly id: IdService,
		private readonly websocket: WebSocketServerInterface
	) {}

	async findById(userId: string): Promise<UserEntitiesInterface> {
		let user = await this.userRepository.findById(userId);
		if (!user) throw new CustomResponse(404);
		return user;
    }

	async findByEmail(email: string): Promise<UserEntitiesInterface> {
		let user = await this.userRepository.findUserByEmail(email);
		if (!user) throw new CustomResponse(404);
		return user;
	}

	async deleteUnconfirmedUsers(): Promise<UserEntitiesInterface[]> {
		const expiredUsers = await this.userRepository.findUnconfirmedUsersWithExpiredLinks();
		for (const user of expiredUsers) {
			if (user.id) await this.userRepository.deleteById(user.id);
		}
		return expiredUsers;
	}

	async getUnconfirmedUsers(): Promise<UserEntitiesInterface[]> {
		return await this.userRepository.findUnconfirmedUsersWithExpiredLinks();
	}

	async confirmUser(confirmationCode: string): Promise<UserEntitiesInterface & { message: string }> {
		const user = await this.userRepository.findUserByConfirmationCode(confirmationCode);
		if (!user) {
			throw new CustomResponse(404, 'Invalid confirmation code');
		}

		if (user.isConfirmed) {
			throw new CustomResponse(400, 'User is already confirmed');
		}

		if (user.confirmationExpiresAt && user.confirmationExpiresAt < new Date()) {
			throw new CustomResponse(400, 'Confirmation link has expired');
		}

		user.isConfirmed = true;
		user.confirmationExpiresAt = undefined;
		user.confirmationToken = null;

		const userSave = await this.userRepository.update(user.id, user);
		console.log(`userSave: ${userSave}`);

		return { ...user ,message: 'User confirmed successfully'};
	}

	async create(item: UserEntitiesInterface): Promise<UserEntitiesInterface> {
		const existingUser = await this.userRepository.findUserByEmail(item.email);
		if (existingUser) {
			throw new CustomResponse(400, 'User already exists');
		}
		const confirmationExpiresIn = 24 * 60 * 60 * 1000; // 24 hours
		const confirmationExpiresAt = new Date(Date.now() + confirmationExpiresIn);
		const user = {...item};
		user.role = 'user';
		user.password = await this.hasher.hash(user.password, 10);
		user.id = this.id.uuid();
		user.confirmationToken = this.id.uuid();
		user.archive = false;
		user.banned = false;
		user.createdAt = new Date();
		user.updatedAt = new Date();
		user.isConfirmed = false;
		user.confirmationExpiresAt = confirmationExpiresAt;
		await this.userRepository.create(user).then((user) => {
			if (!user) {
				throw new Error('User not created');
			}
		});
		return user;
	}

	// TODO: modify to take into account the date for archivedAt
	async delete(id: string): Promise<boolean> {
		return this.userRepository.deleteById(id);
	}

	async findAll(): Promise<UserEntitiesInterface[]> {
		const users = this.userRepository.findAll();
		return Promise.resolve(users);
	}

	async findOne(id: string): Promise<UserEntitiesInterface | null> {
		return this.userRepository.findById(id).then((user) => {
			if (!user) {
				throw new Error('User not found');
			}
			return user;
		});
	}

	async update(userToHandle: UserEntitiesInterface, requestedUser: UserEntitiesInterface, ban?: boolean, archive?: boolean): Promise<UserEntitiesInterface> {
		const user = await this.userRepository.findUserByEmail(userToHandle.email);
		const requestedUserFromRepo = await this.userRepository.findUserByEmail(requestedUser.email);

		if (!user?.isConfirmed) {
			throw new Error('User is not confirmed yet and cannot be updated');
		}

		if (!user || !requestedUserFromRepo) {
			throw new Error(`User not found for email: ${JSON.stringify(userToHandle.email)}`);
		}

		const requestedUserIsAdminOrSuperUser = requestedUserFromRepo.role === 'admin' || requestedUserFromRepo.role === 'superuser';
		const manageUserNotAllowed = (!userToHandle.banned || userToHandle.banned || !userToHandle.archive || userToHandle.archive) && !requestedUserIsAdminOrSuperUser;
		if (manageUserNotAllowed) {
			if (!requestedUserIsAdminOrSuperUser && requestedUser.email !== user.email) {
				throw new Error('You are not authorized to update this user');
			} else {
				throw new Error('You are not authorized to manage this user');
			}
		}

		if (ban) {
			userToHandle.banned = !user.banned;
		}

		if (archive) {
			userToHandle.archive = !user.archive;
		}

		userToHandle.updatedAt = new Date();
		const userUpdate = {...user, ...userToHandle};
		return this.userRepository.update(user.id, userUpdate);
	}

	async findByUsername(username: string): Promise<UserEntitiesInterface> {
		const user = await this.userRepository.findUserByUsername(username);
		if (!user) throw new Error('User not found');
		return user;
	}
}
