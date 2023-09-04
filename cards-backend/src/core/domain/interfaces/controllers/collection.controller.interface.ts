import {CollectionEntityInterface} from "../../endpoints/collection/collection.entity.interface";

export interface CollectionControllerInterface {
	createCollection: (req: any, res: any) => Promise<void>;
	getCollection: (req: any, res: any) => Promise<void>;
	updateCollection: (req: any, res: any) => Promise<CollectionEntityInterface | null>;
	deleteCollection: (req: any, res: any) => Promise<void>;
}