import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ClientErrors } from "../../common/error-messages";
import { RedisService } from "../../core/database/redis/redis.service";
import { UserRole } from "../../core/database/sql/entities/user/user.enums";

export const ROLES_KEY = "roles";
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private readonly redisService: RedisService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRoles = this.reflector.get<UserRole[]>(ROLES_KEY, context.getHandler());
		if (!requiredRoles) return true;

		const { user } = context.switchToHttp().getRequest();
		const { role } = await this.redisService.getValue<{ role: UserRole }>(`user:${user.id}:sess:${user.session}`);
		if (!requiredRoles.includes(role)) {
			throw new ForbiddenException(ClientErrors.Forbidden.NotEnoughPermissions);
		}

		return true;
	}
}
