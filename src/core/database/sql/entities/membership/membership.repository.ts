import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IBaseCRUD } from "src/common/types/crud";
import { ID } from "src/common/types/id";
import { EntityManager, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { Membership } from "./membership.entity";

@Injectable()
export class MembershipRepository implements IBaseCRUD<Membership> {
	constructor(@InjectRepository(Membership) private readonly repo: Repository<Membership>) {}

	private getRepo(manager?: EntityManager): Repository<Membership> {
		return manager ? manager.getRepository(Membership) : this.repo;
	}

	create(body: Partial<Membership>, manager?: EntityManager): Promise<Membership> {
		const r = this.getRepo(manager);
		const entity = r.create(body);
		return r.save(entity);
	}

	isExist(id: ID, manager?: EntityManager): Promise<boolean> {
		const r = this.getRepo(manager);
		return r.exists({ where: { id } } as FindOneOptions<Membership>);
	}

	getById(
		id: ID,
		relations?: FindOneOptions<Membership>["relations"],
		manager?: EntityManager
	): Promise<Membership | null | undefined> {
		const r = this.getRepo(manager);
		return r.findOne({ where: { id }, relations } as FindOneOptions<Membership>);
	}

	getByKey<K extends keyof Membership>(
		key: K,
		value: Membership[K],
		relations?: FindManyOptions<Membership>["relations"],
		manager?: EntityManager
	): Promise<Membership[]> {
		const r = this.getRepo(manager);
		return r.find({
			where: { [key]: value },
			relations
		});
	}

	count(where?: FindManyOptions<Membership>["where"], manager?: EntityManager): Promise<number> {
		const r = this.getRepo(manager);
		return r.count({ where });
	}

	list(
		limit: number,
		offset: number,
		options?: Omit<FindManyOptions<Membership>, "skip" | "take">,
		order?: FindManyOptions<Membership>["order"],
		manager?: EntityManager
	): Promise<Membership[]> {
		const r = this.getRepo(manager);
		return r.find({
			...(options ?? {}),
			order,
			skip: offset ?? 0,
			take: limit ?? 50
		});
	}

	async listAll(
		where?: FindManyOptions<Membership>["where"],
		relations?: FindManyOptions<Membership>["relations"],
		manager?: EntityManager
	): Promise<Membership[]> {
		const r = this.getRepo(manager);
		return r.find({ where, relations });
	}

	async updateById(
		id: ID,
		doc: Partial<Omit<Membership, "id" | "createdAt">>,
		returnDoc: false,
		manager?: EntityManager
	): Promise<number>;
	async updateById(
		id: ID,
		doc: Partial<Omit<Membership, "id" | "createdAt">>,
		returnDoc: true,
		manager?: EntityManager
	): Promise<Membership>;
	async updateById(
		id: ID,
		doc: Partial<Omit<Membership, "id" | "createdAt">>,
		returnDoc?: boolean,
		manager?: EntityManager
	): Promise<number | Membership> {
		const r = this.getRepo(manager);
		const upd = await r.update({ id } as FindOptionsWhere<Membership>, doc);
		if (returnDoc) {
			return r.findOne({ where: { id: Number(id) } as FindOptionsWhere<Membership> }) as Promise<Membership>;
		}
		return upd.affected ?? 0;
	}

	async deleteById(id: ID | ID[], manager?: EntityManager): Promise<void> {
		const r = this.getRepo(manager);
		const ids = Array.isArray(id) ? id.map(Number) : [Number(id)];
		await r.delete(ids);
	}
}
