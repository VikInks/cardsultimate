import {IdInterface} from "../../../config/interfaces/adapters/id.interface";


export class IdService implements IdInterface{
	constructor(private readonly idGenerator: IdInterface) {}

	uuid(): string {
		return this.idGenerator.uuid();
	}
}