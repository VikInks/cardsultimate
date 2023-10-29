/**
 * Interface d'inversion de dépendance pour cookie-parser
 * @interface
 * @name BiscuitInterface
 * @property {Function} biscuitParser - Fonction de cookie-parser
 */
export interface BiscuitInterface {
	// interface d'inversion de dépendance pour cookie-parser
	biscuitParser(
		secret?: string | string[] | undefined,
		options?: any | undefined
	): any;
}