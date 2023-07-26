import {BiscuitInterface} from "../../domain/interfaces/adapters/biscuit.interface";
import cookieParser from "cookie-parser";
import {Adapter} from "../../../libraries/custom/injects/frameworks/decorators/types.decorators";

@Adapter()
export default class BiscuitAdapter implements BiscuitInterface {
	private readonly biscuit: any = cookieParser;
	constructor() {
		this.biscuitParser = this.biscuitParser.bind(this);
	}
	public biscuitParser(secret?: string | string[] | undefined, options?: any): any {
		return this.biscuit(secret, options);
	}
}