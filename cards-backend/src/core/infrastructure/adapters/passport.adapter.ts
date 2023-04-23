import passport from 'passport';
import jwt from 'jsonwebtoken';
import {PassportInterface} from "../../core/domain/interfaces/passport.interface";
import { UserEntitiesInterface as user } from "../../core/domain/interfaces/endpoints/entities/user.entities.interface";
import { IRequest, IResponse, INextFunction } from "../../core/domain/interfaces/requestHandler.interface";
import {LocalityInformationsInterface} from "../../core/domain/interfaces/endpoints/informations/locality.informations.interface";

export class PassportAdapter implements PassportInterface {
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

		return jwt.sign(payload, secret, options);
	}
}