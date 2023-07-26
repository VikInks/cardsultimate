import {IdInterface} from "../../domain/interfaces/adapters/id.interface";
import {Service} from "../../../libraries/custom/injects/frameworks/decorators/types.decorators";

@Service(1)
export default class IdService implements IdInterface{

	constructor(private readonly idGenerator: IdInterface) {}

	uuid(): string {
		return this.idGenerator.uuid();
	}
}