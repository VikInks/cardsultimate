import { v4 as uuid} from 'uuid'
import {IdInterface} from "../../config/interfaces/adapters/id.interface";

export class UuidAdapter implements IdInterface {
	uuid(): string {
		return uuid();
	}
}
