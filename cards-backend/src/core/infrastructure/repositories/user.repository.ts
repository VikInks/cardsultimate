import { UserEntitiesInterface as User } from "../../domain/endpoints/user.entities.interface";
import {OptionalId} from "mongodb";
import {UserRepositoryInterface} from "../../domain/interfaces/repositories/user.repository.interface";
import {DatabaseInterface} from "../../domain/interfaces/adapters/database.interface";

export class UserRepository implements UserRepositoryInterface {
	constructor(private readonly mongoAdapter: DatabaseInterface<User>) {}

	// generic methods
	async create(user: User): Promise<User> {
		const result = await this.mongoAdapter.insertOne(user);
		if (!result.insertedId) {
			throw new Error("Failed to insert user.");
		}
		return { ...user, id: result.insertedId.toHexString() };
	}
	async findById(id: string): Promise<User | null> {
		const objectId = this.mongoAdapter.stringToObjectId(id);
		const user = await this.mongoAdapter.findOne({ _id: objectId });
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	}
	async update(id: string, user: User): Promise<User> {
		const objectId = this.mongoAdapter.stringToObjectId(id);
		const { _id, ...userFields } = user as any;
		const result = await this.mongoAdapter.findOneAndUpdate(
			{ _id: objectId },
			{ $set: userFields },
			{ returnOriginal: false }
		);
		if (!result) {
			throw new Error("User not found");
		}
		return result;
	}

	async deleteById(id: string): Promise<boolean> {
		const objectId = this.mongoAdapter.stringToObjectId(id);
		return await this.mongoAdapter.deleteOne({ id: objectId });
	}
	async findAll(): Promise<User[]> {
		const users = await this.mongoAdapter.find();
		return users.map((user: OptionalId<User>) => {
			const id = user._id?.toHexString() || user.id;
			if (!id) throw new Error("User id is missing.");
			return { ...user, id, _id: undefined };
		});
	}

	// custom methods
	async findUserByEmail(email: string): Promise<User | null> {
		return await this.mongoAdapter.findOne({ email: email });
	}
	async getUserByEmail(email: string): Promise<User | null> {
		const objectEmail = this.mongoAdapter.findOne({ email: email });
		return await this.mongoAdapter.findOne({ email: objectEmail });
	}
	async getUserById(id: string): Promise<User | null> {
		const objectId = this.mongoAdapter.findOne({ id: id });
		return await this.mongoAdapter.findOne({ id: objectId });
	}
	async findUserByConfirmationCode(confirmationToken: string) {
		const user = await this.mongoAdapter.findOne({
			confirmationToken: confirmationToken,
		});
		if (!user) {
			throw new Error("Invalid confirmation code");
		}
		return user;
	}
	async findUnconfirmedUsersWithExpiredLinks() {
		const users = await this.mongoAdapter.find();
		return users.filter((user: OptionalId<User>) => {
			const id = user._id?.toHexString() || user.id;
			if (!id) throw new Error("User id is missing.");
			return (
				!user.isConfirmed &&
				user.confirmationExpiresAt &&
				user.confirmationExpiresAt < new Date()
			);
		});
	}

	async findByRole(role: string): Promise<User | null> {
		const user = this.mongoAdapter.findOne({ role: role });
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	}
}
