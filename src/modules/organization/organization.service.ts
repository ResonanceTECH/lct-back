import { Injectable } from "@nestjs/common";
import { Organization } from "src/core/database/sql/entities/organization/organization.entity";
import { OrganizationRepository } from "src/core/database/sql/entities/organization/organization.repository";
import { UserRepository } from "src/core/database/sql/entities/user/user.repository";
import { CreateOrganizationType } from "./dtos/requests/create.dto";

@Injectable()
export class OrganizationService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly organizationRepository: OrganizationRepository
	) {}

	public async getByName(doc: Pick<CreateOrganizationType, "name" | "inn">): Promise<Organization | null> {
		const [org] = await this.organizationRepository.listAll([{ name: doc.name }, { inn: doc.inn }]);
		return org;
	}

	public async create(doc: CreateOrganizationType, userId: number) {
		const org = await this.organizationRepository.create({ ...doc, createdBy: { id: userId } });
		return org.id;
	}
}
