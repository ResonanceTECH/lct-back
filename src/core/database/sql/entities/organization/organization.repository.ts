import { InjectRepository } from "@nestjs/typeorm";
import { IBaseCRUD } from "src/common/types/crud";
import { ID } from "src/common/types/id";
import { EntityManager, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { Organization } from "./organization.entity";

export class OrganizationRepository implements IBaseCRUD<Organization> {
	constructor(@InjectRepository(Organization) private readonly repo: Repository<Organization>) {}

	private getRepo(manager?: EntityManager): Repository<Organization> {
		return manager ? manager.getRepository(Organization) : this.repo;
	}

	create(body: Partial<Organization>, manager?: EntityManager): Promise<Organization> {
		const r = this.getRepo(manager);
		const entity = r.create(body);
		return r.save(entity);
	}

	isExist(id: ID, manager?: EntityManager): Promise<boolean> {
		const r = this.getRepo(manager);
		return r.exists({ where: { id } } as FindOneOptions<Organization>);
	}

	getById(
		id: ID,
		relations?: FindOneOptions<Organization>["relations"],
		manager?: EntityManager
	): Promise<Organization | null | undefined> {
		const r = this.getRepo(manager);
		return r.findOne({ where: { id }, relations } as FindOneOptions<Organization>);
	}

	getByKey<K extends keyof Organization>(
		key: K,
		value: Organization[K],
		relations?: FindManyOptions<Organization>["relations"],
		manager?: EntityManager
	): Promise<Organization[]> {
		const r = this.getRepo(manager);
		return r.find({
			where: { [key]: value },
			relations
		});
	}

	count(where?: FindManyOptions<Organization>["where"], manager?: EntityManager): Promise<number> {
		const r = this.getRepo(manager);
		return r.count({ where });
	}

	list(
		limit: number,
		offset: number,
		options?: Omit<FindManyOptions<Organization>, "skip" | "take">,
		order?: FindManyOptions<Organization>["order"],
		manager?: EntityManager
	): Promise<Organization[]> {
		const r = this.getRepo(manager);
		return r.find({
			...(options ?? {}),
			order,
			skip: offset ?? 0,
			take: limit ?? 50
		});
	}

	async listAll(
		where?: FindManyOptions<Organization>["where"],
		relations?: FindManyOptions<Organization>["relations"],
		manager?: EntityManager
	): Promise<Organization[]> {
		const r = this.getRepo(manager);
		return r.find({ where, relations });
	}

	async updateById(
		id: ID,
		doc: Partial<Omit<Organization, "id" | "createdAt">>,
		returnDoc: false,
		manager?: EntityManager
	): Promise<number>;
	async updateById(
		id: ID,
		doc: Partial<Omit<Organization, "id" | "createdAt">>,
		returnDoc: true,
		manager?: EntityManager
	): Promise<Organization>;
	async updateById(
		id: ID,
		doc: Partial<Omit<Organization, "id" | "createdAt">>,
		returnDoc?: boolean,
		manager?: EntityManager
	): Promise<number | Organization> {
		const r = this.getRepo(manager);
		const upd = await r.update({ id } as FindOptionsWhere<Organization>, doc);
		if (returnDoc) {
			return r.findOne({ where: { id: Number(id) } as FindOptionsWhere<Organization> }) as Promise<Organization>;
		}
		return upd.affected ?? 0;
	}

	async deleteById(id: ID | ID[], manager?: EntityManager): Promise<void> {
		const r = this.getRepo(manager);
		const ids = Array.isArray(id) ? id.map(Number) : [Number(id)];
		await r.delete(ids);
	}
}
