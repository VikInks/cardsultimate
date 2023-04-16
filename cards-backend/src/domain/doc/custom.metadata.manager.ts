// customMetadataManager.ts
class CustomMetadataManager {
	private metadataStorage: Map<string, any>;

	constructor() {
		this.metadataStorage = new Map();
	}

	defineMetadata(key: string, value: any, target: Object) {
		this.metadataStorage.set(`${target.constructor.name}_${key}`, value);
	}

	getMetadata(key: string, target: Object) {
		return this.metadataStorage.get(`${target.constructor.name}_${key}`);
	}
}

export const customMetadataManager = new CustomMetadataManager();
