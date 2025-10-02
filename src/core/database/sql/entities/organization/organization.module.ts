import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Organization } from "./organization.entity";
import { OrganizationRepository } from "./organization.repository";

@Module({
	imports: [TypeOrmModule.forFeature([Organization])],
	providers: [OrganizationRepository],
	exports: [OrganizationRepository]
})
export class OrganizationRepositoryModule {}
