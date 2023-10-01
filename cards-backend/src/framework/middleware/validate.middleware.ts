import {CustomResponse} from "../error/customResponse";


export function ValidateMiddleware(input: any) {
	if (typeof input.email !== "string" || !input.email.includes("@")) {
		throw new CustomResponse(400, "Invalid email format");
	}
	if (typeof input.password !== "string" || input.password.length < 8 || !input.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/)) {
		throw new CustomResponse(400, "Invalid password format");
	}
}