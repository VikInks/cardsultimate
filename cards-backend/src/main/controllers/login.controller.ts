import { ExpressTypes } from "../../domain/interfaces/requestHandler.interface";
import { Post, Route } from "../router/custom/decorator";
import { LoginInterface } from "../../domain/interfaces/login.interface";

@Route("/login")
export class LoginController implements LoginInterface {
	private readonly loginService: LoginInterface
	constructor(private readonly loginServ: LoginInterface) {
		this.loginService = loginServ;
	}

	/**
	 * @swagger
	 * /login/{email}/{password}:
	 *   post:
	 *     summary: Log in a user
	 *     tags: [Login]
	 *     parameters:
	 *       - in: path
	 *         name: email
	 *         schema:
	 *           type: string
	 *         required: true
	 *         description: The email of the user
	 *       - in: path
	 *         name: password
	 *         schema:
	 *           type: string
	 *         required: true
	 *         description: The password of the user
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
	@Post("/:email/:password")
	async login(req: ExpressTypes["Request"], res: ExpressTypes["Response"], next: ExpressTypes["NextFunction"]) {
		try {
			const { email, password } = req.body;
			const result = await this.loginService.login(email, password, next);
			if (result) {
				res.status(200).json(result);
				return result as { access_token: string };
			}
			return res.status(401).json({ message: "Invalid credentials" });
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @swagger
	 * /login/disconnect:
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
	@Post("/disconnect")
	async disconnect(req: ExpressTypes["Request"], res: ExpressTypes["Response"]) {
		try {
			const result = await this.loginService.disconnect(req, res);
			res.status(200).json(result);
			return result;
		} catch (error) {
			return res.status(500).json({ message: "Internal server error" });
		}
	}
}
