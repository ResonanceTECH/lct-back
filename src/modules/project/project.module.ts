import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { RedisModule } from "src/core/database/redis/redis.module";
import { MembershipRepositoryModule } from "src/core/database/sql/entities/membership/membership.module";
import { OrganizationRepositoryModule } from "src/core/database/sql/entities/organization/organization.module";
import { ProjectRepositoryModule } from "src/core/database/sql/entities/project/project.module";
import { UserRepositoryModule } from "src/core/database/sql/entities/user/user.module";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";

@Module({
	imports: [
		JwtModule.register({}),
		RedisModule,
		UserRepositoryModule,
		OrganizationRepositoryModule,
		ProjectRepositoryModule,
		MembershipRepositoryModule
	],
	controllers: [ProjectController],
	providers: [ProjectService]
})
export class ProjectModule {}
