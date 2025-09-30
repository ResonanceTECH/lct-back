import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ZodValidationPipe } from "nestjs-zod";
import { RedisModule } from "./core/database/redis/redis.module";
import { dataSourceOptions } from "./core/database/sql/sql.config";
import { AuthGuard } from "./modules/auth/auth.guard";
import { AuthModule } from "./modules/auth/auth.module";
import { RolesGuard } from "./modules/auth/roles.guard";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		JwtModule.register({}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async () => dataSourceOptions
		}),
		RedisModule,
		AuthModule
	],
	controllers: [],
	providers: [
		{ provide: APP_PIPE, useClass: ZodValidationPipe },
		{ provide: APP_GUARD, useClass: AuthGuard },
		{ provide: APP_GUARD, useClass: RolesGuard }
	]
})
export class AppModule {}
