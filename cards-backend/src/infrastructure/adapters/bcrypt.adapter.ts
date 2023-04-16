import { HasherInterface } from "../../domain/interfaces/hasher.interface";
import { hash, compare } from 'bcrypt'

export class BcryptAdapter implements HasherInterface {
	async hash(password: string, salt: number): Promise<string> {
		return hash(password, salt);
	}

	async compare(password: string, hash: string): Promise<boolean> {
		return compare(password, hash);
	}
}
