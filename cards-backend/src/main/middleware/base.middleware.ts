export abstract class BaseMiddleware {
	protected getTokenFromHeader(authorization: string | undefined): string | null {
		if (!authorization) {
			return null;
		}
		return authorization.split(" ")[1];
	}

	protected getTokenFromCookie(cookies: { [key: string]: string } | undefined, cookieName: string): string | null {
		if (!cookies || !cookies[cookieName]) {
			return null;
		}
		return cookies[cookieName];
	}
}