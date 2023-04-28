import {Delete, Get, Post, Route,} from '../../framework/router/custom/decorator';
import {UserControllerInterface} from '../../domain/interfaces/controllers/user.controller.interface';
import {HasherInterface} from '../../domain/interfaces/adapters/hasher.interface';
import {UserServiceInterface} from '../../domain/interfaces/services/user.service.interface';
import {LoginServiceInterface} from '../../domain/interfaces/services/login.service.interface';
import {IdInterface} from '../../domain/interfaces/adapters/id.interface';
import {EmailServiceInterface} from '../../domain/interfaces/services/email.service.interface';
import {ServerType} from '../../domain/interfaces/adapters/request.handler.interface';
import {CustomError} from '../../framework/error/customError';

@Route('/user')
export class UserController implements UserControllerInterface {
	private readonly hasher: HasherInterface;
	private readonly userService: UserServiceInterface;
	private readonly loginService: LoginServiceInterface;
	private readonly idService: IdInterface;
	private readonly emailService: EmailServiceInterface;

	constructor(
		private readonly crypt: HasherInterface,
		private readonly userServ: UserServiceInterface,
		private readonly loginServ: LoginServiceInterface,
		private readonly idServ: IdInterface,
		private readonly emailServ: EmailServiceInterface
	) {
		this.hasher = crypt;
		this.userService = userServ;
		this.loginService = loginServ;
		this.idService = idServ;
		this.emailService = emailServ;
	}

	/**
	 * @swagger
	 * /user/register:
	 *   post:
	 *     summary: Register a new user
	 *     tags: [User]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/UserEntitiesInterface'
	 *     responses:
	 *       201:
	 *         description: User created successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/UserEntitiesInterface'
	 *       409:
	 *         description: User already exists
	 *       500:
	 *         description: Something went wrong
	 */
	@Post('/register')
	async register(req: ServerType['Request'], res: ServerType['Response'], next: ServerType['NextFunction']): Promise<void> {
		try {
			await this.userService.create(req.body).then(async (user) => {
				await this.emailService.sendConfirmationEmail(user.email, user.confirmationToken as string).then(() => {
					res.status(201).json("User created successfully");
				}).catch((err) => {
					throw new CustomError(500, `err.message ${err.message}`);
				});
			}).catch((err) => {
				throw new CustomError(500, `err.message ${err.message}`);
			});
		} catch (err) {
			throw new CustomError(500, `err.message ${err}`);
		}
	}

	/**
	 * @swagger
	 * /user/confirm/{token}:
	 *   get:
	 *     summary: Confirm a user account
	 *     tags: [User]
	 *     parameters:
	 *       - in: path
	 *         name: token
	 *         schema:
	 *           type: string
	 *         required: true
	 *         description: The confirmation token
	 *     responses:
	 *       200:
	 *         description: User account confirmed successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 id:
	 *                   type: string
	 *                 username:
	 *                   type: string
	 *                 email:
	 *                   type: string
	 *                 isConfirmed:
	 *                   type: boolean
	 *       404:
	 *         description: User not found
	 *       500:
	 *         description: Something went wrong
	 */
	@Get('/confirm/:token')
	async confirmAccount(req: ServerType['Request'], res: ServerType['Response'], next: ServerType['NextFunction']): Promise<void> {
		try {
			await this.userService.confirmUser(req.params.token).then(() => {
				return res.status(200).json("User confirmed");
			}).catch((error) => {
				throw new CustomError(500, error.message);
			});
		} catch (error) {
			throw new CustomError(500, "Something went wrong")
		}
	}

	/**
	 * @swagger
	 * /user/find-by-email/{email}:
	 *   post:
	 *     summary: Find a user by email
	 *     tags: [User]
	 *     parameters:
	 *       - in: path
	 *         name: email
	 *         schema:
	 *           type: string
	 *         required: true
	 *         description: The email of the user to find
	 *     responses:
	 *       200:
	 *         description: The user description by email
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/UserEntitiesInterface'
	 *       404:
	 *         description: The user was not found
	 *       500:
	 *         description: Something went wrong
	 */
	@Post('/find-by-email/:email', {middlewares: ['isAuthenticated', 'isSuperUser', 'isAdmin']})
	async findByEmail(req: ServerType['Request'], res: ServerType['Response'], next: ServerType['NextFunction']): Promise<void> {
		try {
			await this.userService.findByEmail(req.params.email).then((user) => {
				return res.status(200).json(user);
			}).catch(() => {
				throw new CustomError(500, 'User not found');
			});
		} catch (error) {
			throw new CustomError(500, "Something went wrong")
		}
	}

	/**
	 * @swagger
	 * /user/find-by-username/{username}:
	 *   post:
	 *     summary: Find a user by username
	 *     tags: [User]
	 *     security:
	 *       - BearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: username
	 *         schema:
	 *           type: string
	 *         required: true
	 *         description: The username of the user to find
	 *     responses:
	 *       200:
	 *         description: The user description by username
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/UserEntitiesInterface'
	 *       404:
	 *         description: The user was not found
	 *       500:
	 *         description: Something went wrong
	 */
	@Post('/find-by-username/:username', {middlewares: ['isAuthenticated']})
	async findByUsername(req: ServerType['Request'], res: ServerType['Response'], next: ServerType['NextFunction']): Promise<void> {
		try {
			await this.userService.findByUsername(req.params.username).then((user) => {
				return res.status(200).json(user?.username);
			}).catch(() => {
				throw new CustomError(500, 'User not found');
			});
		} catch (error) {
			throw new CustomError(500, "Something went wrong")
		}
	}

	/**
	 * @swagger
	 * /user/update:
	 *   post:
	 *     summary: Update user information
	 *     tags: [User]
	 *     security:
	 *       - BearerAuth: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/UserEntitiesInterface'
	 *     responses:
	 *       200:
	 *         description: User updated
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/UserEntitiesInterface'
	 *       403:
	 *         description: Only the user can update his profile
	 *       404:
	 *         description: User not found
	 *       500:
	 *         description: Something went wrong
	 */
	@Post('/update', {middlewares: ['isAuthenticated']})
	async update(req: ServerType['Request'], res: ServerType['Response'], next: ServerType['NextFunction']): Promise<void> {
		try {
			await this.userService.update(req.body, req.user).then(() => {
				res.status(200).json('User updated');
			}).catch((error) => {
				throw new CustomError(500, error.message);
			});
		} catch (error) {
			throw new CustomError(500, "Something went wrong")
		}
	}

	/**
	 * @swagger
	 * /user/archive:
	 *   delete:
	 *     summary: Archive user
	 *     tags: [User]
	 *     security:
	 *       - BearerAuth: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               email:
	 *                 type: string
	 *     responses:
	 *       200:
	 *         description: User archived
	 *       404:
	 *         description: User not found
	 *       500:
	 *         description: Something went wrong
	 */
	@Delete('/archive', {middlewares: ['isAuthenticated']})
	async handleUserArchive(req: ServerType['Request'], res: ServerType['Response'], next: ServerType['NextFunction']): Promise<void> {
		const userEmail = req.body.email;
		const userToArchive = await this.userService.findByEmail(userEmail);
		if (!userToArchive) throw new CustomError(404, 'User not found');
		try {
			await this.userService.update(userToArchive, req.user, false, true).then(() => {
				res.status(200).json({message: 'User archived'});
			}).catch((error) => {
				throw new CustomError(500, `User not found ${error}`);
			});
		} catch (error) {
			throw new CustomError(500, "Something went wrong")
		}
	}

	/**
	 * @swagger
	 * /user/ban:
	 *   post:
	 *     summary: Ban user
	 *     tags: [User]
	 *     security:
	 *       - BearerAuth: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               email:
	 *                 type: string
	 *     responses:
	 *       200:
	 *         description: User banned
	 *       404:
	 *         description: User not found
	 *       500:
	 *         description: Something went wrong
	 */
	@Post('/ban', {middlewares: ['isAuthenticated', 'isSuperUser', 'isAdmin'],})
	async handleUserBan(req: ServerType['Request'], res: ServerType['Response'], next: ServerType['NextFunction']): Promise<void> {
		const userEmail = req.body.email;
		const userToBan = await this.userService.findByEmail(userEmail);
		if (!userToBan) throw new CustomError(404, 'User not found');
		try {
			await this.userService.update(userToBan, req.user, true, false).then(() => {
				res.status(200).json({message: 'User banned'});
			}).catch((error) => {
				throw new CustomError(500, `Something went wrong ${error}`);
			});
		} catch (error) {
			throw new CustomError(500, "Something went wrong")
		}
	}
}
