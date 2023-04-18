import {LocalityInformationsInterface} from "../informations/locality.informations.interface";

export interface UserEntitiesInterface {
	id: string;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	locality: LocalityInformationsInterface
	password: string;
	role: string;
	archive: boolean;
	banned: boolean;
	createdAt: Date;
	updatedAt: Date;
	confirmationToken: string | null;
	confirmationExpiresAt?: Date;
	isConfirmed?: boolean;
}