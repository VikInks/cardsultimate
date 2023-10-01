import {CardsEntityInterface} from "../../../domain/cards/cards.entity.interface";


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
}

export interface CardRepositoryInterface {
	find(params: cardParameters): Promise<CardsEntityInterface | CardsEntityInterface[] | null>
	initializeCards(): Promise<void>
}