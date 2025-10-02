import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IBaseCRUD } from "src/common/types/crud";
import { ID } from "src/common/types/id";
import { EntityManager, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UserRepository implements IBaseCRUD<User> {
	constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

	private getRepo(manager?: EntityManager): Repository<User> {
		return manager ? manager.getRepository(User) : this.repo;
	}

	create(body: Partial<User>, manager?: EntityManager): Promise<User> {
		const r = this.getRepo(manager);
		const entity = r.create(body);
		return r.save(entity);
	}

	isExist(id: ID, manager?: EntityManager): Promise<boolean> {
		const r = this.getRepo(manager);
		return r.exists({ where: { id } } as FindOneOptions<User>);
	}

	getById(
		id: ID,
		relations?: FindOneOptions<User>["relations"],
		manager?: EntityManager
	): Promise<User | null | undefined> {
		const r = this.getRepo(manager);
		return r.findOne({ where: { id }, relations } as FindOneOptions<User>);
	}

	getByKey<K extends keyof User>(
		key: K,
		value: User[K],
		relations?: FindManyOptions<User>["relations"],
		manager?: EntityManager
	): Promise<User[]> {
		const r = this.getRepo(manager);
		return r.find({
			where: { [key]: value },
			relations
		});
	}

	count(where?: FindManyOptions<User>["where"], manager?: EntityManager): Promise<number> {
		const r = this.getRepo(manager);
		return r.count({ where });
	}

	list(
		limit: number,
		offset: number,
		options?: Omit<FindManyOptions<User>, "skip" | "take">,
		order?: FindManyOptions<User>["order"],
		manager?: EntityManager
	): Promise<User[]> {
		const r = this.getRepo(manager);
		return r.find({
			...(options ?? {}),
			order,
			skip: offset ?? 0,
			take: limit ?? 50
		});
	}

	async listAll(
		where?: FindManyOptions<User>["where"],
		relations?: FindManyOptions<User>["relations"],
		manager?: EntityManager
	): Promise<User[]> {
		const r = this.getRepo(manager);
		return r.find({ where, relations });
	}

	async updateById(
		id: ID,
		doc: Partial<Omit<User, "id" | "createdAt">>,
		returnDoc: false,
		manager?: EntityManager
	): Promise<number>;
	async updateById(
		id: ID,
		doc: Partial<Omit<User, "id" | "createdAt">>,
		returnDoc: true,
		manager?: EntityManager
	): Promise<User>;
	async updateById(
		id: ID,
		doc: Partial<Omit<User, "id" | "createdAt">>,
		returnDoc?: boolean,
		manager?: EntityManager
	): Promise<number | User> {
		const r = this.getRepo(manager);
		const upd = await r.update({ id } as FindOptionsWhere<User>, doc);
		if (returnDoc) {
			return r.findOne({ where: { id: Number(id) } as FindOptionsWhere<User> }) as Promise<User>;
		}
		return upd.affected ?? 0;
	}

	async deleteById(id: ID | ID[], manager?: EntityManager): Promise<void> {
		const r = this.getRepo(manager);
		const ids = Array.isArray(id) ? id.map(Number) : [Number(id)];
		await r.delete(ids);
	}
}
