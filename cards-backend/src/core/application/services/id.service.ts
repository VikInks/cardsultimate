import {IdInterface} from "../../domain/interfaces/adapters/id.interface";


export default class IdService implements IdInterface{

	constructor(private readonly idGenerator: IdInterface) {}

	uuid(): string {
		return this.idGenerator.uuid();
	}
}