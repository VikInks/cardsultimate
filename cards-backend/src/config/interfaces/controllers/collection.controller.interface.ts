export interface CollectionControllerInterface {
	createCollection: (req: any, res: any, next: any) => Promise<void>;
	getCollection: (req: any, res: any, next: any) => Promise<void>;
	updateCollection: (req: any, res: any, next: any) => Promise<void>;
	deleteCollection: (req: any, res: any, next: any) => Promise<void>;
	sellManagerCollection: (req: any, res: any, next: any) => Promise<void>;
	setPublicCanView: (req: any, res: any, next: any) => Promise<void>;
	setCardsToExchangeList: (req: any, res: any, next: any) => Promise<void>;
	setCardsToSellList: (req: any, res: any, next: any) => Promise<void>;
}