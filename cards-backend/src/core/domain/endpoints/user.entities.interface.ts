import {LocalityInformationsInterface} from "./locality.informations.interface";


export interface UserEntitiesInterface {
	/**
	 * @nodisplay
	 */
	id: string;
	/**
	 * @required
	 * @example
	 */
	username: string;
	/**
	 * @required
	 * @example
	 */
	email: string;
	/**
	 * @required
	 * @example
	 */
	firstName: string;
	/**
	 * @required
	 * @example
	 */
	lastName: string;
	/**
	 * @required
	 * @example
	 */
	locality: LocalityInformationsInterface
	/**
	 * @required
	 * @example
	 */
	password: string;
	/**
	 * @nodisplay
	 */
	role: string;
	/**
	 * @nodisplay
	 */
	archive: boolean;
	/**
	 * @nodisplay
	 */
	banned: boolean;
	/**
	 * @nodisplay
	 */
	createdAt: Date;
	/**
	 * @nodisplay
	 */
	updatedAt: Date;
	/**
	 * @nodisplay
	 */
	confirmationToken?: string | null;
	/**
	 * @nodisplay
	 */
	confirmationExpiresAt?: Date;
	/**
	 * @nodisplay
	 */
	isConfirmed?: boolean;
}