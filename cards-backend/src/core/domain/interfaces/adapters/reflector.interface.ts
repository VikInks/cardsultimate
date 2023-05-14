export interface ReflectorInterface {
	getMetadata<T>(metadataKey: any, target: any): T;
	defineMetadata(metadataKey: any, metadataValue: any, target: any): void;
}
