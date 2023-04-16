import {UserEntitiesInterface as User} from "../../domain/interfaces/entities/user.entities.interface";
import {UserRepositoryInterface} from "../../domain/interfaces/repositories/user.repository.interface";
import {DatabaseInterface, WithOptionalIds} from "../../domain/interfaces/database.interface";
import {ObjectId} from "mongodb";

export class UserRepository implements UserRepositoryInterface {
	private readonly collectionName = "users";
	constructor(private readonly mongoAdapter: DatabaseInterface<User>) {}

	// generic methods
	async create(user: User): Promise<User> {
		const result = await this.mongoAdapter.insertOne(user);
		return { ...user, id: result.insertedId.toHexString() };
	}
	async findById(id: string): Promise<User | null> {
		const objectId = this.mongoAdapter.stringToObjectId(id);
		const user = await this.mongoAdapter.findOne({_id: objectId});
		if (!user) {
			throw new Error('User not found');
		}
		return user;
	}
	async update(id: string, user: User): Promise<User> {
		const objectId = this.mongoAdapter.stringToObjectId(id);
		const { id: _, ...userFields } = user;
		const result = await this.mongoAdapter.findOneAndUpdate({ _id: objectId }, { $set: userFields }, { returnOriginal: false });
		if(!result) {
			throw new Error('User not found');
		}
		return result;
	}
	async deleteById(id: string): Promise<boolean> {
		const objectId = this.mongoAdapter.stringToObjectId(id);
		return await this.mongoAdapter.deleteOne({_id: objectId});
	}
	async findAll(): Promise<User[]> {
		const users = await this.mongoAdapter.find<User>(this.collectionName);
		return users.map((user: User & WithOptionalIds<ObjectId>) => {
			const id = user._id?.toHexString() || user.id;
			if (!id) throw new Error("User id is missing.");
			return { ...user, id, _id: undefined };
		});
	}

	// custom methods
	async findUserByEmail(email: string): Promise<User | null> {
		return await this.mongoAdapter.findOne({email});
	}
	async getUserByEmail(email: string): Promise<User | null> {
		const objectEmail = this.mongoAdapter.findOne({_email: email});
		return await this.mongoAdapter.findOne({_email: objectEmail});
	}
	async getUserById(id: string): Promise<User | null> {
		const objectId = this.mongoAdapter.findOne({_id: id});
		return await this.mongoAdapter.findOne({_id: objectId});
	}
	async findUserByConfirmationCode(confirmationCode: string) {
		const user = await this.mongoAdapter.findOne({confirmationCode});
		if (!user) {
			throw new Error('Invalid confirmation code');
		}
		return user;
	}
	async findUnconfirmedUsersWithExpiredLinks() {
		const users = await this.mongoAdapter.find<User>(this.collectionName);
		return users.filter((user: User & WithOptionalIds<ObjectId>) => {
			const id = user._id?.toHexString() || user.id;
			if (!id) throw new Error("User id is missing.");
			return !user.isConfirmed && user.confirmationExpiresAt && user.confirmationExpiresAt < new Date();
		});
	}
}
