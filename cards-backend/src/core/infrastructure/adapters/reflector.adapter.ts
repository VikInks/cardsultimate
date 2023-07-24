import 'reflect-metadata';
import {ReflectorInterface} from "../../domain/interfaces/adapters/reflector.interface";


export default class ReflectorAdapter implements ReflectorInterface {
	getMetadata<T>(metadataKey: any, target: any): T {
		return Reflect.getMetadata(metadataKey, target);
	}

	defineMetadata(metadataKey: any, metadataValue: any, target: any): void {
		Reflect.defineMetadata(metadataKey, metadataValue, target);
	}
}
