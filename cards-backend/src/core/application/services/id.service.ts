import {IdInterface} from "../core/domain/interfaces/adapters/id.interface";

export class IdService implements IdInterface{
	private idGenerator: IdInterface;

	constructor(private readonly id: IdInterface) {
		this.idGenerator = id;
	}

	uuid(): string {
		return this.idGenerator.uuid();
	}
}