export class BaseFactory {
	protected readonly instances = new Map<string, any>();

	protected getInstance<T>(instanceKey: string): T | undefined {
		return this.instances.get(instanceKey) || undefined;
	}

	protected registerInstance(instanceKey: string, instance: any): void {
		this.instances.set(instanceKey, instance);
	}
}
