export interface CollectionControllerInterface {
	createCollection: (req: any, res: any) => Promise<void>;
	getCollection: (req: any, res: any) => Promise<void>;
	updateCollection: (req: any, res: any) => Promise<void>;
	deleteCollection: (req: any, res: any) => Promise<void>;
}