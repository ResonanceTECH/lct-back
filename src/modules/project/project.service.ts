import { BadRequestException, Injectable } from "@nestjs/common";
import { ClientErrors } from "src/common/error-messages";
import { IPagination, IPaginationResponse } from "src/common/types/pagination";
import { MembershipRepository } from "src/core/database/sql/entities/membership/membership.repository";
import { OrganizationRepository } from "src/core/database/sql/entities/organization/organization.repository";
import { Project } from "src/core/database/sql/entities/project/project.entity";
import { ProjectRepository } from "src/core/database/sql/entities/project/project.repository";
import { UserRepository } from "src/core/database/sql/entities/user/user.repository";
import { In } from "typeorm";
import { CreateProjectType } from "./dtos/requests/create";

@Injectable()
export class ProjectService {
	constructor(
		private readonly organizationRepository: OrganizationRepository,
		private readonly projectRepository: ProjectRepository,
		private readonly userRepository: UserRepository,
		private readonly membershipRepository: MembershipRepository
	) {}

	async create(doc: CreateProjectType, userId: number) {
		const isOwner = await this.organizationRepository.count({ id: doc.organizationId, createdBy: { id: userId } });
		if (!isOwner) throw new BadRequestException(ClientErrors.NotFound.OrganizationNotFound);

		if (!doc.supervisorId) doc.supervisorId = userId;
		else {
			const isMember = await this.membershipRepository.count({
				userId: doc.supervisorId,
				organizationId: doc.organizationId
			});
			if (!isMember) throw new BadRequestException(ClientErrors.NotFound.UserNotFound);
		}

		const project = await this.projectRepository.create(doc);
		return project.id;
	}

	async list(userId: number, pagination: IPagination): Promise<IPaginationResponse<Project>> {
		const memberships = await this.membershipRepository.listAll({ user: { id: userId } });
		const organizations = await this.organizationRepository.listAll({ createdById: userId });
		const ids = [memberships.map((m) => m.organizationId), organizations.map((o) => o.id)].flat();

		if (!ids.length) return { total: 0, rows: [] };

		const total = await this.projectRepository.count({ organizationId: In(ids) });
		if (!total) return { total: 0, rows: [] };

		const projects = await this.projectRepository.list(pagination.limit, pagination.limit * pagination.offset, {
			where: { organizationId: In(ids) },
			select: {
				id: true,
				name: true,
				status: true,
				startAt: true,
				endAt: true,
				city: true,
				appointment: true,
				latitude: true,
				longitude: true,
				organization: { id: true, name: true }
			}
		});
		return { total, rows: projects };
	}
}
