import {CardsEntityInterface} from "../../../domain/cards/cards.entity.interface";


/**
 * @interface cardParameters
 * @memberOf CardRepositoryInterface
 * @property {string} id
 * @property {string} name
 * @property {boolean} foil
 * @property {string} artist
 * @property {string} mana_cost
 * @property {number} cmc
 * @property {string} type_line
 * @property {string} oracle_text
 * @property {string} power
 * @property {string} toughness
 * @property {string[]} colors
 * @property {string[]} color_identity
 * @property {string} set
 * @property {string} rarity
 *
 * @description
 * This interface is used to define the parameters that can be used to search for cards in the database.
 *
 * @example
 * const params: cardParameters = {
 * 	id: "1234",
 * 		name: "Lightning Bolt",
 * 		foil: false,
 * 		artist: "Christopher Rush",
 * 		mana_cost: "{R}",
 * 		cmc: 1,
 * 		type_line: "Instant",
 * 		oracle_text: "Lightning Bolt deals 3 damage to any target.",
 * 		power: null,
 * 		toughness: null,
 * 		colors: ["R"],
 * 		color_identity: ["R"],
 * 		set: "LEA",
 * 		rarity: "Common"
 * 		}
 *
 * 		const cards = await cardRepository.find(params);
 *
 * @autor VikInks
 */
export interface cardParameters {
	id?: string,
	name?: string,
	foil?: boolean,
	artist?: string,
	mana_cost?: string,
	cmc?: number,
	type_line?: string,
	oracle_text?: string,
	power?: string,
	toughness?: string,
	colors?: string[],
	color_identity?: string[],
	set?: string,
	rarity?: string,
}

export interface CardRepositoryInterface {
	find(params: cardParameters): Promise<CardsEntityInterface | CardsEntityInterface[] | null>
	initializeCards(): Promise<void>
	update(cards: any[]): Promise<void>
}