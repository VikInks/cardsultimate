import passport from 'passport';
import {PassportInterface} from "../../domain/interfaces/adapters/passport.interface";
import {INextFunction, IRequest, IResponse} from "../../domain/interfaces/adapters/requestHandler.interface";
import { UserEntitiesInterface as user} from "../../domain/endpoints/user.entities.interface";
import {LocalityInformationsInterface} from "../../domain/endpoints/locality.informations.interface";
import {TokenInterface} from "../../domain/interfaces/adapters/token.interface";

export class PassportAdapter implements PassportInterface {
	constructor(private readonly token: TokenInterface) {
	}
	public initialize() {
		return passport.initialize();
	}

	public session() {
		return passport.session();
	}

	public use(strategy: any) {
		passport.use(strategy);
	}

	public authenticate(strategy: string, options: passport.AuthenticateOptions) {
		return (req: IRequest, res: IResponse, next: INextFunction) => {
			passport.authenticate(strategy, options)(req as any, res as any, next as any);
		};
	}

	public serializeUser(fn: (user: user, done: (err: any, id: any) => void) => void) {
		passport.serializeUser((user: object, done) => {
			fn(user as user, done);
		});
	}

	public deserializeUser(fn: (id: any, done: (err: any, user: user) => void) => void) {
		passport.deserializeUser<any, any>((id, done) => {
			fn(id, done);
		});
	}

	public sign(payload: { role: string; locality: LocalityInformationsInterface; email: string; username: string }): string {
		const secret = process.env.JWT_SECRET;
		if (!secret) {
			throw new Error('JWT secret is not defined');
		}
		const options = {
			expiresIn: '1h',
		};

		return this.token.sign(payload, secret, options);
	}
}