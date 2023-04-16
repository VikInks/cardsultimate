export interface BaseRepositoryInterface<T> {
	create(item: T): Promise<T>;
	findById(id: string): Promise<T | null>;
	update(id: string, item: T): Promise<T>;
	deleteById(id: string): Promise<boolean>;
	findAll(): Promise<T[]>;
}