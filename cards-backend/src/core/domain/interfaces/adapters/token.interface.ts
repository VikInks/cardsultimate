export interface TokenInterface {
	sign(payload: object, secretOrPrivateKey: string, options?: object): string;
	verify(token: string, secretOrPublicKey: string, options?: object): object | string;
}