
import { hash, compare } from 'bcrypt'
import {HasherInterface} from "../../domain/interfaces/adapters/hasher.interface";

export class BcryptAdapter implements HasherInterface {
	async hash(password: string, salt: number): Promise<string> {
		return hash(password, salt);
	}

	async compare(password: string, hash: string): Promise<boolean> {
		return compare(password, hash);
	}
}
