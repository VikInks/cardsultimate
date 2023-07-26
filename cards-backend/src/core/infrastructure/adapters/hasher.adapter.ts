import { hash, compare } from 'bcrypt'
import {HasherInterface} from "../../domain/interfaces/adapters/hasher.interface";
import {Adapter} from "../../../libraries/custom/injects/frameworks/decorators/types.decorators";

@Adapter()
export default class HasherAdapter implements HasherInterface {
	async hash(password: string, salt: number): Promise<string> {
		return hash(password, salt);
	}

	async compare(password: string, hash: string): Promise<boolean> {
		return compare(password, hash);
	}
}
