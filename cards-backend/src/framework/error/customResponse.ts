import {
	HTTP_STATUS_CLIENT,
	HTTP_STATUS_INFORMATIONAL,
	HTTP_STATUS_REDIRECTION, HTTP_STATUS_SERVER,
	HTTP_STATUS_SUCCESS
} from "../status/list.status";

export class CustomResponse extends Error {
	statusCode: number;

	constructor(statusCode: number, customMessage?: string) {
		const message = customMessage || CustomResponse.getMessageFromStatusCode(statusCode);
		super(message);
		this.statusCode = statusCode;
	}

	private static getMessageFromStatusCode(statusCode: number): string {
		const allStatuses: Record<number, string> = {
			...HTTP_STATUS_INFORMATIONAL,
			...HTTP_STATUS_SUCCESS,
			...HTTP_STATUS_REDIRECTION,
			...HTTP_STATUS_CLIENT,
			...HTTP_STATUS_SERVER
		};

		return allStatuses[statusCode] || 'Unknown error';
	}
}
