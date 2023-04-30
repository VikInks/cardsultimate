import {ImageUrlsInterface} from "./image.urls.interface";
import {LegalityInterface} from "./legality.interface";
import {PricesInterface} from "./prices.interface";
import {RelatedUrisInterface} from "./related.uris.inteface";
import {AllpartInterface} from "./allpart.interface";
import {PreviewInterface} from "./preview.interface";
import {CardFaceInterface} from "./card.face.interface";
import {DeckEntityInterface} from "../decks/deck.entity.interface";

export interface CardsEntityInterface {
	object: string
	id: string
	oracle_id: string
	multiverse_ids: string
	mtgo_id: string
	mtgo_foil_id: string
	tcgplayer_id: string
	cardmarket_id: string
	name: string
	lang: string
	released_at: string
	uri: string
	scryfall_uri: string
	layout: string
	highres_image: string
	image_status: string
	image_uris: ImageUrlsInterface
	mana_cost: string
	cmc: string
	type_line: string
	oracle_text: string
	power: string
	toughness: string
	colors: string
	color_identity: string
	keywords: string
	legalities: LegalityInterface
	games: string
	reserved: string
	foil: string
	nonfoil: string
	finishes: string
	oversized: string
	promo: string
	reprint: string
	variation: string
	set_id: string
	set: string
	set_name: string
	set_type: string
	set_uri: string
	set_search_uri: string
	scryfall_set_uri: string
	rulings_uri: string
	prints_search_uri: string
	collector_number: string
	digital: string
	rarity: string
	flavor_text: string
	card_back_id: string
	artist: string
	artist_ids: string
	illustration_id: string
	border_color: string
	frame: string
	full_art: string
	textless: string
	booster: string
	story_spotlight: string
	edhrec_rank: string
	penny_rank: string
	prices: PricesInterface
	related_uris: RelatedUrisInterface
	printed_name: string
	printed_type_line: string
	printed_text: string
	security_stamp: string
	all_parts: AllpartInterface[]
	promo_types: string
	arena_id: string
	loyalty: string
	watermark: string
	frame_effects: string
	preview: PreviewInterface
	produced_mana: string
	card_faces: CardFaceInterface[]
	color_indicator: string
	tcgplayer_etched_id: string
	content_warning: string
	attraction_lights: string
	variation_of: string
	life_modifier: string
	hand_modifier: string
	flavor_name: string
	number: number
	deck_in: DeckEntityInterface[]
}