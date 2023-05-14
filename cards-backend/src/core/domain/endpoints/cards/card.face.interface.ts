import {ImageUris2Interface} from "./image.uris.2.interface";

export interface CardFaceInterface {
	object: string
	name: string
	mana_cost: string
	type_line: string
	oracle_text: string
	colors: string
	image_uris: ImageUris2Interface
}