import {Post, Route} from "../../framework/router/custom/decorator";
import {LoginControllerInterface} from "../../config/interfaces/controllers/login.controller.interface";
import {LoginServiceInterface} from "../../config/interfaces/services/login.service.interface";
import {CustomResponse} from "../../framework/error/customResponse";
import {HttpRequest, HttpResponse, NextFunction} from "../../config/interfaces/adapters/server.interface";

/**
 * @swagger
 * tags:
 *   name: Login
 *   description: Login management
 */
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
	@Post("/signin", { middlewares: ['rateLimitLogin']})
	async login(req: HttpRequest, res: HttpResponse, next: NextFunction) {
		const existingCookie = req.cookie.cardsToken;
		if (existingCookie) {
			next(new CustomResponse(401));
		}

		const {email, password} = req.body;
		try {
			await this.loginService.login(email, password).then((token) => {
				if (token.access_token) {
					res.cookie('cardsToken', token.access_token, {
						maxAge: 86400000,
						httpOnly: true,
						path: '/',
						secure: process.env.NODE_ENV === 'production',
					});
					next(new CustomResponse(200, 'User logged in successfully'));
				}
			});
		} catch (error) {
			next(new CustomResponse(500, 'Error logging in user'));
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
	async disconnect(req: HttpRequest, res: HttpResponse, next: NextFunction) {
		const existingCookie = req.cookie.cardsToken;
		if (!existingCookie) {
			next(new CustomResponse(401));
		}

		try {
			await this.loginService.disconnect();
			res.clearCookie('cardsToken');
			res.cookie('cardsToken', '', {
				expires: new Date(Date.now() - 86400000),
				path: '/',
			});
			next(new CustomResponse(200, 'User disconnected'));
		} catch (error) {
			next(new CustomResponse(500, 'Error disconnecting user'));
		}
	}
}