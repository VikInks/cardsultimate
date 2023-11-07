import {UserEntitiesInterface} from "../domain/user.entities.interface";
import {UserRepositoryInterface} from "../config/interfaces/repositories/user.repository.interface";
import {HasherAdapter} from "../infrastructure/adapters/hasher.adapter";
import {UuidAdapter} from "../infrastructure/adapters/uuid.adapter";


export async function createSuperUserIfNotExists(userRepository: UserRepositoryInterface, bcryptAdapter: HasherAdapter, uuidAdapter: UuidAdapter) {
	const existingSuperUser = await userRepository.findByRole('SuperUser');
	if (existingSuperUser) {
		console.log('SuperUser already exists.');
		return;
	}

	const superUser : UserEntitiesInterface = {
		archive: false,
		banned: false,
		confirmationToken: null,
		createdAt: new Date(),
		firstName: "a",
		lastName: "a",
		locality: {
			city: "a",
			country: "a",
			npa: "1",
			street: "a",
			streetNumber: "1",
			region: "a"
		},
		updatedAt: new Date(),
		username: "publicagent",
		id: uuidAdapter.uuid(),
		email: 'a@a.com',
		password: await bcryptAdapter.hash('a', 10),
		role: 'superuser',
		isConfirmed: true,
		confirmationExpiresAt: undefined
	};

	await userRepository.create(superUser);
	console.log('SuperUser created successfully.');
}
