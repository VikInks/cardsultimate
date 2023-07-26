import jwt from 'jsonwebtoken';
import {TokenInterface} from "../../domain/interfaces/adapters/token.interface";
import {Adapter} from "../../../libraries/custom/injects/frameworks/decorators/types.decorators";

@Adapter()
export default class TokenAdapter implements TokenInterface {
	sign(payload: object, secretOrPrivateKey: string, options?: object): string {
		return jwt.sign(payload, secretOrPrivateKey, options);
	}

	verify(token: string, secretOrPublicKey: string, options?: object): object | string {
		return jwt.verify(token, secretOrPublicKey, options);
	}
}