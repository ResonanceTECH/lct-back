import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { RedisModule } from "src/core/database/redis/redis.module";
import { UserRepositoryModule } from "src/core/database/sql/entities/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { RolesGuard } from "./roles.guard";

@Module({
	imports: [JwtModule.register({}), RedisModule, UserRepositoryModule],
	controllers: [AuthController],
	providers: [AuthService, AuthGuard, RolesGuard],
	exports: [AuthGuard, RolesGuard]
})
export class AuthModule {}
