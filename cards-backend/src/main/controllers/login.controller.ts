import { ExpressTypes } from "../../domain/interfaces/requestHandler.interface";
import { Post, Route } from "../router/custom/decorator";
import { LoginInterface } from "../../domain/interfaces/login.interface";

@Route("/login")
export class LoginController implements LoginInterface {
	private readonly loginService: LoginInterface
	constructor(private readonly loginServ: LoginInterface) {
		this.loginService = loginServ;
	}

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
