import {Get, Post, Route} from "../router/custom/decorator";
import {UserServiceInterface} from "../../domain/interfaces/services/user.service.interface";
import {LoginServiceInterface} from "../../domain/interfaces/services/login.service.interface";
import {IRequest, IResponse} from "../../domain/interfaces/requestHandler.interface";
import {
	SwaggerAuthControllerInterface
} from "../../domain/interfaces/endpoints/controllers/swagger.auth.controller.interface";
import {HasherInterface} from "../../domain/interfaces/hasher.interface";
import swaggerUi from "swagger-ui-express";
import {generateSwagger} from "../../domain/doc/swagger.doc";

@Route("/swagger-admin")
export class SwaggerAuthController implements SwaggerAuthControllerInterface {
	private readonly hasher: HasherInterface;
	private readonly userService: UserServiceInterface;
	private readonly loginService: LoginServiceInterface;

	constructor(private readonly bcryptAdapter: HasherInterface, private readonly userServ: UserServiceInterface,private readonly loginServ: LoginServiceInterface) {
		this.hasher = bcryptAdapter;
		this.loginService = loginServ;
		this.userService = userServ;
	}

	private getLoginFormHTML(): string {
		return `
			    <!DOCTYPE html>
			<html lang="en">
			<head>
			  <meta charset="UTF-8">
			  <meta name="viewport" content="width=device-width, initial-scale=1.0">
			  <title>Swagger Login</title>
			  <style>
			    body {
			      font-family: Arial, sans-serif;
			      background-color: #000;
			    }
			
			    .container {
			      display: flex;
			      justify-content: center;
			      align-items: center;
			      height: 100vh;
			    }
			
			    form {
			      background-color: #fff;
			      padding: 2rem;
			      border-radius: 5px;
			      box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
			    }
			
			    label {
			      display: block;
			      margin-bottom: 0.5rem;
			    }
			
			    input {
			      width: 100%;
			      padding: 0.5rem;
			      margin-bottom: 1rem;
			      box-sizing: border-box;
			      border: 1px solid #ccc;
			    }
			
			    button {
			      width: 100%;
			      padding: 0.5rem;
			      border: none;
			      background-color: #000;
			      color: #fff;
			      cursor: pointer;
			      border-radius: 3px;
			    }
			
			    button:hover {
			      background-color: #333;
			    }
			  </style>
			</head>
			<body>
			  <div class="container">
			    <form id="login-form">
			      <label for="email">Email:</label>
			      <input type="email" id="email" name="email" required>
			      <label for="password">Password:</label>
			      <input type="password" id="password" name="password" required>
			      <button type="submit">Login</button>
			    </form>
			  </div>
			  <script>
				 document.getElementById('login-form').addEventListener('submit', async (event) => {
				    event.preventDefault();
				    const email = document.getElementById('email').value;
				    const password = document.getElementById('password').value;
				    const response = await fetch('/swagger-admin', {
				        method: 'POST',
				        headers: {
				            'Content-Type': 'application/json',
				        },
				        body: JSON.stringify({ email, password }),
				    });
				    console.log(response);
				    if (response.status === 302) {
				        const redirectTo = response.headers.get('Location');
				        if (redirectTo) {
				            window.location.href = redirectTo;
				        } else {
				            alert('Redirection échouée');
				        }
				    } else if (response.ok) {
				        alert('Connecté avec succès, mais aucune redirection n\\'a été reçue');
				    } else {
				        alert('Identifiants invalides');
				    }
				});
			  </script>
			</body>
			</html>
  `;
	}

	@Get("/login")
	public async showLoginForm(_: IRequest, res: IResponse): Promise<void> {
		res.send(this.getLoginFormHTML());
	}

	@Post("/docs", {middlewares: ['auth', 'isSuperUser']})
	public async docs(_: IRequest, res: IResponse): Promise<void> {
		const swaggerSpec = await generateSwagger();
		res.send(swaggerUi.generateHTML(swaggerSpec));
	}
}
