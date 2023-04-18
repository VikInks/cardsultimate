import {BcryptAdapter} from "../infrastructure/adapters/bcrypt.adapter";
import {UuidAdapter} from "../infrastructure/adapters/uuid.adapter";
import {UserEntitiesInterface} from "../domain/interfaces/endpoints/entities/user.entities.interface";
import {UserRepositoryInterface} from "../domain/interfaces/repositories/user.repository.interface";

export async function createSuperUserIfNotExists(userRepository: UserRepositoryInterface, bcryptAdapter: BcryptAdapter, uuidAdapter: UuidAdapter) {
	const existingSuperUser = await userRepository.findByRole('SuperUser');
	console.log('existingSuperUser', existingSuperUser);
	// Si un SuperUser existe déjà, ne faites rien
	if (existingSuperUser) {
		console.log('SuperUser already exists.');
		return;
	}

	// Sinon, créez un nouvel utilisateur avec le rôle 'SuperUser'
	const superUser : UserEntitiesInterface = {
		archive: false,
		banned: false,
		confirmationToken: null,
		createdAt: new Date(),
		firstName: "",
		lastName: "",
		locality: {
			city: "",
			country: "",
			npa: "",
			street: "",
			streetNumber: "",
			region: ""
		},
		updatedAt: new Date(),
		username: "",
		id: uuidAdapter.uuid(),
		email: 'a@a.com',
		password: await bcryptAdapter.hash('a', 10),
		role: 'SuperUser',
		isConfirmed: true
	};

	// Enregistrez le nouvel utilisateur SuperUser dans la base de données
	await userRepository.create(superUser);
	console.log('SuperUser created successfully.');
}
