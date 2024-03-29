
import { hash, compare } from 'bcrypt'
import {HasherInterface} from "../../config/interfaces/adapters/hasher.interface";

export class HasherAdapter implements HasherInterface {
	async hash(password: string, salt: number): Promise<string> {
		return hash(password, salt);
	}

	async compare(password: string, hash: string): Promise<boolean> {
		return compare(password, hash);
	}
}
