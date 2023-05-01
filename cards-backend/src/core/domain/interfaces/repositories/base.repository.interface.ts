export interface BaseRepositoryInterface<T> {
	create(item: T, id?:string): Promise<T>;
	findById(id: string): Promise<T | null>;
	update(id: string, item: T): Promise<T>;
	deleteById(id: string, otherId?:string): Promise<boolean>;
	findAll(): Promise<T[]>;
}