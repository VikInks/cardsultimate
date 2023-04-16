import {ExpressTypes} from "../../domain/interfaces/requestHandler.interface";
import {UserEntitiesInterface} from '../../domain/interfaces/entities/user.entities.interface';
import {Delete, Post, Route} from "../router/custom/decorator";
import {HasherInterface} from "../../domain/interfaces/hasher.interface";
import {UserServiceInterface} from "../../domain/interfaces/services/user.service.interface";
import {EmailServiceInterface} from "../../domain/interfaces/services/emailServiceInterface";
import {LoginInterface} from "../../domain/interfaces/login.interface";
import {IdInterface} from "../../domain/interfaces/id.interface";

@Route('/user')
export class UserController {
	private readonly hasher: HasherInterface
	private readonly userService: UserServiceInterface
	private readonly loginService: LoginInterface
	private readonly idService: IdInterface
	private readonly emailService: EmailServiceInterface

	constructor(
		private readonly crypt: HasherInterface,
		private readonly userServ: UserServiceInterface,
		private readonly loginServ: LoginInterface,
		private readonly idServ: IdInterface,
		private readonly emailServ: EmailServiceInterface)
	{
		this.hasher = crypt;
		this.userService = userServ;
		this.loginService = loginServ;
		this.idService = idServ;
		this.emailService = emailServ;
	}

	@Post('/register')
	async register(req: ExpressTypes['Request'], res: ExpressTypes['Response'], next: ExpressTypes['NextFunction']): Promise<void> {
		try {
			const items: UserEntitiesInterface = req.body;
			const exist = await this.userService.findByEmail(items.email);
			if (exist) {
				res.status(409).json({message: 'User already exists'});
				return;
			}
			items.password = await this.hasher.hash(items.password, 10);
			items.confirmationToken = this.idService.uuid();
			const user = await this.userService.create(items);
			if (user.confirmationToken) {
				const emailText = 'Please confirm your account by clicking the link below:';
				const emailHtml = `<p>Please confirm your account by clicking the link below:</p><a href="https://cards.com/confirm/${user.id}">Confirm Account</a>`;
				await this.emailService.sendConfirmationEmail(user.email, user.confirmationToken, emailText, emailHtml);
				res.status(201).json(user);
			} else {
				res.status(500).json({message: 'Something went wrong'});
			}
		} catch (error) {
			next(error);
		}
	}

	@Post('/find-by-email/:email', {middlewares: ["auth", "isSuperUser", "isAdmin"]})
	async findByEmail(req: ExpressTypes['Request'], res: ExpressTypes['Response'], next: ExpressTypes['NextFunction']): Promise<void> {
		try {
			const user = await this.userService.findByEmail(req.params.email);
			res.status(200).json(user);
		} catch (error) {
			next(error);
		}
	}

	@Post('/verify-password/:email/:password')
	async verifyPassword(req: ExpressTypes['Request'], res: ExpressTypes['Response'], next: ExpressTypes['NextFunction']): Promise<void> {
		try {
			const {email, password} = req.body;
			const user = await this.userService.findByEmail(email);
			if (!user) {
				res.status(401).json({message: 'User not found'});
				return;
			}

			const isValidPassword = await this.hasher.compare(password, user.password);

			if (!isValidPassword) {
				res.status(401).json({message: 'Invalid password'});
				return;
			}

			res.status(200).json({message: 'Password is valid'});
		} catch (error) {
			next(error);
		}
	}

	@Post('/update/:email', {middlewares: ["auth"]})
	async update(req: ExpressTypes['Request'], res: ExpressTypes['Response'], next: ExpressTypes['NextFunction']): Promise<void> {
		try {
			const items: UserEntitiesInterface = req.body;
			const user = await this.userService.findByEmail(req.user.email);
			if (!user) {
				res.status(404).json({message: 'User not found'});
				return;
			}
			const connectedUser = req.user;
			if (connectedUser.email !== user.email || connectedUser.role !== 'SuperUser') {
				res.status(403).json({message: 'Forbidden: Only the user can update his profile'});
				return;
			}
			const id = user.id;
			const newUser = {...user, ...items};
			const updatedUser = await this.userService.update(id, newUser);

			res.status(200).json(updatedUser);
		} catch (error) {
			next(error);
		}
	}

	@Delete('/archive/:email', {middlewares: ['auth']})
	async archive(req: ExpressTypes['Request'], res: ExpressTypes['Response'], next: ExpressTypes['NextFunction']): Promise<void> {
		try {
			const {email} = req.body;
			const user = await this.userService.findByEmail(email);
			if (!user) {
				res.status(404).json({message: 'User not found'});
				return;
			}
			user.archive = true;
			await this.userService.update(user.id, user);
			res.status(200).json({message: 'User archived'});
		} catch (error) {
			next(error);
		}
	}

	@Post('/unarchive/:email', {middlewares: ['auth', 'isSuperUser', "isAdmin"]})
	async unarchive(req: ExpressTypes['Request'], res: ExpressTypes['Response'], next: ExpressTypes['NextFunction']): Promise<void> {
		try {
			const {email} = req.body;
			const user = await this.userService.findByEmail(email);
			if (!user) {
				res.status(404).json({message: 'User not found'});
				return;
			}
			user.archive = false;
			await this.userService.update(user.id, user);
			res.status(200).json({message: 'User unarchived'});
		} catch (error) {
			next(error);
		}
	}

	@Post('/ban/:email', {middlewares: ["auth", "isSuperUser", "isAdmin"]})
	async ban(req: ExpressTypes['Request'], res: ExpressTypes['Response'], next: ExpressTypes['NextFunction']): Promise<void> {
		try {
			const {email} = req.body;
			const user = await this.userService.findByEmail(email);
			if (!user) {
				res.status(404).json({message: 'User not found'});
				return;
			}
			user.banned = true;
			await this.userService.update(user.id, user);
			res.status(200).json({message: 'User banned'});
		} catch (error) {
			next(error);
		}
	}

	@Post('/unban/:email', {middlewares: ["auth", "isSuperUser", "isAdmin"]})
	async unban(req: ExpressTypes['Request'], res: ExpressTypes['Response'], next: ExpressTypes['NextFunction']): Promise<void> {
		try {
			const {email} = req.body;
			const user = await this.userService.findByEmail(email);
			if (!user) {
				res.status(404).json({message: 'User not found'});
				return;
			}
			user.banned = false;
			await this.userService.update(user.id, user);
			res.status(200).json({message: 'User unbanned'});
		} catch (error) {
			next(error);
		}
	}

	@Post('/change-password/:email', {middlewares: ["auth"]})
	async changePassword(req: ExpressTypes['Request'], res: ExpressTypes['Response'], next: ExpressTypes['NextFunction']): Promise<void> {
		try {
			const {email, password} = req.body;
			const user = await this.userService.findByEmail(email);
			if (!user) {
				res.status(404).json({message: 'User not found'});
				return;
			}
			user.password = await this.hasher.hash(password, 10);
			await this.userService.update(user.id, user);
			res.status(200).json({message: 'Password changed'});
		} catch (error) {
			next(error);
		}
	}
}
