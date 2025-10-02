import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { RedisModule } from "src/core/database/redis/redis.module";
import { OrganizationRepositoryModule } from "src/core/database/sql/entities/organization/organization.module";
import { UserRepositoryModule } from "src/core/database/sql/entities/user/user.module";
import { OrganizationController } from "./organization.controller";
import { OrganizationService } from "./organization.service";

@Module({
	imports: [JwtModule.register({}), RedisModule, UserRepositoryModule, OrganizationRepositoryModule],
	controllers: [OrganizationController],
	providers: [OrganizationService]
})
export class OrganizationModule {}
