import { BadRequestException, Injectable } from "@nestjs/common";
import { ClientErrors } from "src/common/error-messages";
import { MembershipRepository } from "src/core/database/sql/entities/membership/membership.repository";
import { OrganizationRepository } from "src/core/database/sql/entities/organization/organization.repository";
import { ProjectRepository } from "src/core/database/sql/entities/project/project.repository";
import { UserRepository } from "src/core/database/sql/entities/user/user.repository";
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
}
