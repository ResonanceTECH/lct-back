import { EntityManager } from "typeorm";
import { ID } from "./id";

export interface IBaseCRUD<T extends { id: ID }> {
	create(body: any, manager?: EntityManager): Promise<T>;
	isExist(id: ID, manager?: EntityManager): Promise<boolean>;
	getById(id: ID, relations: any, manager?: EntityManager): Promise<T | null | undefined>;
	getByKey<K extends keyof T>(key: K, value: T[K], relations: any, manager?: EntityManager): Promise<T[]>;
	count(where?: any, manager?: EntityManager): Promise<number>;
	list(limit: number, offset: number, options: any, order?: any, manager?: EntityManager): Promise<T[]>;
	listAll(where?: any, relations?: any, manager?: EntityManager): Promise<T[]>;
	updateById(
		id: ID,
		doc: Partial<Omit<T, "id" | "created">>,
		returnDoc: false,
		manager?: EntityManager
	): Promise<number>;
	updateById(id: ID, doc: Partial<Omit<T, "id" | "created">>, returnDoc: true, manager?: EntityManager): Promise<T>;
	deleteById(id: ID | ID[], manager?: EntityManager): Promise<void>;
}
