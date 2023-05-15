import {Post, Route} from "../../framework/router/custom/decorator";
import {LoginControllerInterface} from "../../domain/interfaces/controllers/login.controller.interface";
import {LoginServiceInterface} from "../../domain/interfaces/services/login.service.interface";
import {Request, Response} from "../../domain/interfaces/adapters/server.interface";
import {CustomError} from "../../framework/error/customError";


@Route("/login")
export class LoginController implements LoginControllerInterface {

	constructor(private readonly loginService: LoginServiceInterface) {}

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
	@Post("/signin", { middlewares: ['CheckUserStatus']})
	async login(req: Request, res: Response) {
		const existingCookie = req.cookies.cardsToken;
		if (existingCookie) {
			return res.status(200).json({message: "User already connected"});
		}

		const {email, password} = req.body;
		try {
			await this.loginService.login(email, password).then((token) => {
				if (token.access_token) {
					res.cookie('cardsToken', token.access_token, {
						maxAge: 86400000,
						httpOnly: true,
						path: '/',
						secure: process.env.NODE_ENV === 'production'
					});
					res.status(200).json({message: "User successfully connected"});
				}
			});
		} catch (error) {
			throw new CustomError(401, "Invalid credentials")
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
	async disconnect(req: Request, res: Response) {
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