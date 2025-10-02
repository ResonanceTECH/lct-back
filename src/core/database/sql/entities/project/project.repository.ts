import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IBaseCRUD } from "src/common/types/crud";
import { ID } from "src/common/types/id";
import { EntityManager, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { Project } from "./project.entity";

@Injectable()
export class ProjectRepository implements IBaseCRUD<Project> {
	constructor(@InjectRepository(Project) private readonly repo: Repository<Project>) {}

	private getRepo(manager?: EntityManager): Repository<Project> {
		return manager ? manager.getRepository(Project) : this.repo;
	}

	create(body: Partial<Project>, manager?: EntityManager): Promise<Project> {
		const r = this.getRepo(manager);
		const entity = r.create(body);
		return r.save(entity);
	}

	isExist(id: ID, manager?: EntityManager): Promise<boolean> {
		const r = this.getRepo(manager);
		return r.exists({ where: { id } } as FindOneOptions<Project>);
	}

	getById(
		id: ID,
		relations?: FindOneOptions<Project>["relations"],
		manager?: EntityManager
	): Promise<Project | null | undefined> {
		const r = this.getRepo(manager);
		return r.findOne({ where: { id }, relations } as FindOneOptions<Project>);
	}

	getByKey<K extends keyof Project>(
		key: K,
		value: Project[K],
		relations?: FindManyOptions<Project>["relations"],
		manager?: EntityManager
	): Promise<Project[]> {
		const r = this.getRepo(manager);
		return r.find({
			where: { [key]: value },
			relations
		});
	}

	count(where?: FindManyOptions<Project>["where"], manager?: EntityManager): Promise<number> {
		const r = this.getRepo(manager);
		return r.count({ where });
	}

	list(
		limit: number,
		offset: number,
		options?: Omit<FindManyOptions<Project>, "skip" | "take">,
		order?: FindManyOptions<Project>["order"],
		manager?: EntityManager
	): Promise<Project[]> {
		const r = this.getRepo(manager);
		return r.find({
			...(options ?? {}),
			order,
			skip: offset ?? 0,
			take: limit ?? 50
		});
	}

	async listAll(
		where?: FindManyOptions<Project>["where"],
		relations?: FindManyOptions<Project>["relations"],
		manager?: EntityManager
	): Promise<Project[]> {
		const r = this.getRepo(manager);
		return r.find({ where, relations });
	}

	async updateById(
		id: ID,
		doc: Partial<Omit<Project, "id" | "createdAt">>,
		returnDoc: false,
		manager?: EntityManager
	): Promise<number>;
	async updateById(
		id: ID,
		doc: Partial<Omit<Project, "id" | "createdAt">>,
		returnDoc: true,
		manager?: EntityManager
	): Promise<Project>;
	async updateById(
		id: ID,
		doc: Partial<Omit<Project, "id" | "createdAt">>,
		returnDoc?: boolean,
		manager?: EntityManager
	): Promise<number | Project> {
		const r = this.getRepo(manager);
		const upd = await r.update({ id } as FindOptionsWhere<Project>, doc);
		if (returnDoc) {
			return r.findOne({ where: { id: Number(id) } as FindOptionsWhere<Project> }) as Promise<Project>;
		}
		return upd.affected ?? 0;
	}

	async deleteById(id: ID | ID[], manager?: EntityManager): Promise<void> {
		const r = this.getRepo(manager);
		const ids = Array.isArray(id) ? id.map(Number) : [Number(id)];
		await r.delete(ids);
	}
}
