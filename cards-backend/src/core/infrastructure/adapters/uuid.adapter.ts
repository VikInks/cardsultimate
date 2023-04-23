import { v4 as uuid} from 'uuid'
import {IdInterface} from "../../core/domain/interfaces/id.interface";


export class UuidAdapter implements IdInterface {
	uuid(): string {
		return uuid();
	}
}
