import { v4 as uuid} from 'uuid'
import {IdInterface} from "../../domain/interfaces/adapters/id.interface";
import {Adapter} from "../../../libraries/custom/injects/frameworks/decorators/types.decorators";

@Adapter()
export default class UuidAdapter implements IdInterface {
	uuid(): string {
		return uuid();
	}
}
