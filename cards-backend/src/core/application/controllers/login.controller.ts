import {Post, Route} from "../../framework/router/custom/decorator";
import {LoginControllerInterface} from "../../domain/interfaces/controllers/login.controller.interface";
import {LoginServiceInterface} from "../../domain/interfaces/services/login.service.interface";
import {ServerType} from "../../domain/interfaces/adapters/request.handler.interface";
import {CustomError} from "../../framework/error/customError";


@Route("/login")
export class LoginController implements LoginControllerInterface {
	private readonly loginService: LoginServiceInterface

	constructor(private readonly loginServ: LoginServiceInterface) {
		this.loginService = loginServ;
	}

	/**
	 * @swagger
	 * /login/signin:
	 *   post:
	 *     summary: Log in a user
	 *     tags: [Login]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               email:
	 *                 type: string
	 *                 required: true
	 *               password:
	 *                 type: string
	 *                 required: true
	 *     responses:
	 *       200:
	 *         description: User logged in successfully
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 access_token:
	 *                   type: string
	 *       401:
	 *         description: Invalid credentials
	 *       500:
	 *         description: Something went wrong
	 */
	@Post("/signin")
	async login(req: ServerType["Request"], res: ServerType["Response"]) {
		try {
			const {email, password} = req.body;
			const {payload, access_token} = await this.loginService.login(email, password);
			if (access_token) {
				res.cookie('cardsToken', access_token, {
					maxAge: 86400000,
					httpOnly: true,
					path: '/',
					secure: process.env.NODE_ENV === 'production'
				});
				res.status(200).json({message: "User successfully connected"});
			} else {
				res.status(401).json({message: "Invalid credentials"});
			}
		} catch (error) {
			throw new CustomError(500, `Something went wrong ${error}`);
		}
	}


	/**
	 * @swagger
	 * /login/signout:
	 *   post:
	 *     summary: Disconnect a user
	 *     tags: [Login]
	 *     security:
	 *       - BearerAuth: []
	 *     responses:
	 *       200:
	 *         description: User disconnected successfully
	 *       500:
	 *         description: Internal server error
	 */
	@Post("/signout")
	async disconnect(req: ServerType["Request"], res: ServerType["Response"]) {
		try {
			await this.loginService.disconnect();
			res.clearCookie('cardsToken');
			res.cookie('cardsToken', '', {
				expires: new Date(Date.now() - 86400000),
				path: '/',
			});
			res.status(200).json({message: "User successfully disconnected"});
		} catch (error) {
			return res.status(500).json({message: "Internal server error"});
		}
	}
}