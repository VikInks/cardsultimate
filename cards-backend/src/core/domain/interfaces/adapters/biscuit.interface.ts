export interface BiscuitInterface {
	// interface d'inversion de dépendance pour cookie-parser
	biscuitParser(
		secret?: string | string[] | undefined,
		options?: any | undefined
	): any;
}