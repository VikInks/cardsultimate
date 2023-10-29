import {CardsEntityInterface} from "../cards/cards.entity.interface";

export interface CollectionEntityInterface {
	id: string;
	idOwner: string;
	cards: CardsEntityInterface[];
	updateDate: Date;
	isPrivate: boolean;
	sellManage: boolean;
}