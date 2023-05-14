import jwt from 'jsonwebtoken';
import {TokenInterface} from "../../domain/interfaces/adapters/token.interface";

export class TokenAdapter implements TokenInterface {
	sign(payload: object, secretOrPrivateKey: string, options?: object): string {
		return jwt.sign(payload, secretOrPrivateKey, options);
	}

	verify(token: string, secretOrPublicKey: string, options?: object): object | string {
		return jwt.verify(token, secretOrPublicKey, options);
	}
}